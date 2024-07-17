import { ConstraintWrapper } from '../../matching/constraints/constraint';

export interface ConstraintBuilderOverlayData {
  constraintWrapper?: ConstraintWrapper;
  onClosed: () => void;
}
