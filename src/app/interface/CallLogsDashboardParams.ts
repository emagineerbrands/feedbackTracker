import { DateRange } from "./DateRange";

export interface CallLogsDashboardParams{
  VolumeOfCalls:DateRange;
  DistributionOfCalls:DateRange;
  EngagementLevelOfCalls:DateRange;
  EngagementCallsPerProduct:DateRange;
  PickUpCallsPerProduct:DateRange;
}
