export interface ConfirmationOverlayData {
  title: string;
  description: string;

  primaryAction: () => void;
  primaryText: string;
  primaryButtonClass?: string;
  secondaryAction?: () => void;
  secondaryText?: string;
  secondaryButtonStyle?: string;

  isDismissable?: boolean;
}
