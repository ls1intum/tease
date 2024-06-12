import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import { Allocation } from 'src/app/api/models';
import { ConstraintWrapper } from '../matching/constraints/constraint';
import { environment } from 'src/environments/environment';

export interface CollaborationData {
  allocations: Allocation[];
  constraints: ConstraintWrapper[];
  lockedStudents: [string, string][];
}
@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  connection: CompatClient | undefined = undefined;
  private subscriptions: StompSubscription[] = [];
  private discoverySubscription: StompSubscription | undefined;

  private readonly url = location.hostname;
  private readonly secure = location.protocol === 'https:';

  constructor() {}

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions || []) {
      subscription.unsubscribe();
    }
    this.discoverySubscription?.unsubscribe();
  }

  private async connect(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.connection?.connected) {
        resolve(true);
        return;
      }
      this.connection = Stomp.client(`${this.secure ? 'wss' : 'ws'}://${this.url}/ws`);

      try {
        this.connection.connect({}, () => {
          resolve(true);
        });
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }

  async send(courseIterationId: string, path: string, text?: string): Promise<void> {
    if (!this.connection?.connected) {
      return;
    }
    this.connection.send(`/app/course-iteration/${courseIterationId}/${path}`, {}, text);
  }

  async subscribe(courseIterationId: string, topic: string, callback: (data: any) => void): Promise<void> {
    const connected = await this.connect();
    if (!connected) {
      throw new Error('Could not connect to STOMP');
    }

    this.subscriptions.push(
      this.connection?.subscribe(`/topic/course-iteration/${courseIterationId}/${topic}`, message => {
        callback(JSON.parse(message.body));
      })
    );
  }

  async discover(courseIterationId: string): Promise<CollaborationData> {
    this.subscriptions = [];
    this.discoverySubscription?.unsubscribe();
    const connected = await this.connect();
    if (!connected) {
      throw new Error('Could not connect to STOMP');
    }

    return new Promise(async (resolve, reject) => {
      let timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for message'));
      }, 5000);

      this.discoverySubscription = this.connection?.subscribe(
        `/topic/course-iteration/${courseIterationId}/discovery`,
        message => {
          clearTimeout(timeout);
          resolve(JSON.parse(message.body));
        }
      );

      this.send(courseIterationId, 'discovery');
    });
  }
}
