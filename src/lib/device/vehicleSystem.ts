interface IDrivable {
  drive(): void;
}

interface IParkAssist {
  park(): void;
}

interface IAutopilot {
  autopilot(): void;
}

interface IRefuelable {
  refuel(): void;
}

interface IChargeable {
  charge(): void;
}

interface ITrunkAccess {
  openTrunk(): void;
}

class ElectricCar implements IDrivable, IChargeable, ITrunkAccess {
  drive() {
    console.log('Driving...');
  }
  charge() {
    console.log('Recharging...');
  }
  openTrunk() {
    console.log('Opening the trunk...');
  }
}

class HybridCar implements IDrivable, IRefuelable, IChargeable {
  drive() {
    console.log('Driving...');
  }
  refuel() {
    console.log('Refueling....');
  }
  charge() {
    console.log('Recharging...');
  }
}
