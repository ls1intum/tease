import { Injectable, OnDestroy } from '@angular/core';
import { CollaborationData, WebsocketService } from '../network/websocket.service';
import { OverlayService } from 'src/app/overlay.service';
import { AllocationsService } from '../data/allocations.service';
import { ConstraintsService } from '../data/constraints.service';
import { LockedStudentsService } from '../data/locked-students.service';
import { StompSubscription } from '@stomp/stompjs';
import { ConfirmationOverlayComponent } from 'src/app/components/confirmation-overlay/confirmation-overlay.component';
import { GLOBALS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class CollaborationService implements OnDestroy {
  private discoverySubscription?: StompSubscription;
  private subscriptions: StompSubscription[] = [];

  constructor(
    private websocketService: WebsocketService,
    private overlayService: OverlayService,
    private allocationsService: AllocationsService,
    private constraintsService: ConstraintsService,
    private lockedStudentsService: LockedStudentsService
  ) {}

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions || []) {
      subscription.unsubscribe();
    }
    this.discoverySubscription?.unsubscribe();
  }

  private async discover(courseIterationId: string): Promise<CollaborationData> {
    return new Promise<CollaborationData>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for message'));
      }, 5000);

      this.websocketService
        .subscribe(courseIterationId, GLOBALS.WS_TOPIC_DISCOVERY, collaborationData => {
          clearTimeout(timeout);
          this.discoverySubscription?.unsubscribe();
          console.log('Discovered collaboration data');
          resolve(collaborationData);
        })
        .then(subscription => {
          this.discoverySubscription = subscription;
          this.websocketService.send(courseIterationId, GLOBALS.WS_TOPIC_DISCOVERY);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  private async subscribe(courseIterationId: string): Promise<void> {
    await this.subscribeToAllocations(courseIterationId);
    await this.subscribeToLockedStudents(courseIterationId);
    await this.subscribeToConstraints(courseIterationId);
  }

  async connect(courseIterationId: string): Promise<void> {
    if (!courseIterationId) {
      return;
    }
    const serverCollaborationData = await this.discover(courseIterationId);
    if (!serverCollaborationData || !serverCollaborationData.allocations) {
      this.subscribe(courseIterationId);
      return;
    }

    if (
      this.allocationsService.equalsCurrentAllocations(serverCollaborationData.allocations) &&
      this.constraintsService.equalsCurrentConstraints(serverCollaborationData.constraints) &&
      this.lockedStudentsService.equalsCurrentLockedStudentsUsingKeyValuePair(serverCollaborationData.lockedStudents)
    ) {
      this.subscribe(courseIterationId);
      return;
    }

    const overlayData = {
      title: 'Connected to Collaboration Service',
      description:
        'The Collaboration Service has a different allocations and constraints state available. Do you want to load it? This will overwrite your current allocations, constraints and locked students. Not loading it will overwrite the other data. Be careful, this action cannot be undone.',
      primaryText: 'Use Collaboration Data',
      primaryButtonStyle: 'btn-secondary',
      primaryAction: async () => {
        const serverCollaborationData = await this.discover(courseIterationId);
        this.allocationsService.setAllocations(serverCollaborationData.allocations, false);
        this.constraintsService.setConstraints(serverCollaborationData.constraints, false);
        this.lockedStudentsService.setLocksAsArray(serverCollaborationData.lockedStudents, false);
        await this.subscribe(courseIterationId);
        this.overlayService.closeOverlay();
      },
      secondaryText: 'Overwrite Collaboration Data',
      secondaryButtonStyle: 'btn-warn',
      secondaryAction: async () => {
        await this.subscribe(courseIterationId);
        this.overlayService.closeOverlay();
      },
      isDismissable: false,
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }

  async disconnect(): Promise<void> {
    this.discoverySubscription?.unsubscribe();
    for (const subscription of this.subscriptions || []) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];

    this.websocketService.connection.disconnect();
  }

  private async subscribeToAllocations(courseIterationId: string): Promise<void> {
    this.websocketService.send(
      courseIterationId,
      GLOBALS.WS_TOPIC_ALLOCATIONS,
      this.allocationsService.getAllocationsAsString()
    );

    this.subscriptions.push(
      await this.websocketService.subscribe(courseIterationId, GLOBALS.WS_TOPIC_ALLOCATIONS, allocations => {
        console.log('Received allocations');
        this.allocationsService.setAllocations(allocations, false);
      })
    );
  }

  private async subscribeToLockedStudents(courseIterationId: string): Promise<void> {
    this.websocketService.send(
      courseIterationId,
      GLOBALS.WS_TOPIC_LOCKED_STUDENTS,
      this.lockedStudentsService.getLocksAsString()
    );

    this.subscriptions.push(
      await this.websocketService.subscribe(courseIterationId, GLOBALS.WS_TOPIC_LOCKED_STUDENTS, lockedStudents => {
        this.lockedStudentsService.setLocksAsArray(lockedStudents, false);
      })
    );
  }

  private async subscribeToConstraints(courseIterationId: string): Promise<void> {
    this.websocketService.send(
      courseIterationId,
      GLOBALS.WS_TOPIC_CONSTRAINTS,
      this.constraintsService.getConstraintsAsString()
    );

    this.subscriptions.push(
      await this.websocketService.subscribe(courseIterationId, GLOBALS.WS_TOPIC_CONSTRAINTS, constraints => {
        this.constraintsService.setConstraints(constraints, false);
      })
    );
  }
}
