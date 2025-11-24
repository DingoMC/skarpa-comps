export interface IVehicleSystem {
  drive(): void;
  park(): void;
  autopilot(): void;
  refuel(): void;
  charge(): void;
  openTrunk(): void;
}
