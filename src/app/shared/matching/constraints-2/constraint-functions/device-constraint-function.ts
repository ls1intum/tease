import { ConstraintFunction, SelectData, SelectGroup } from './constraint-function';
import { Device } from 'src/app/api/models';
import { Operator, mapTwoValues } from '../constraint-utils';

export class DeviceConstraintFunction extends ConstraintFunction {
  override getConstraintFunction(projectId: string, property: string, operator: Operator, value: string): string {
    return this.combineStudentAndProjects(
      projectId,
      this.students.filter(student => student.devices.includes(value as Device))
    );
  }

  override getProperties(): SelectGroup {
    return { name: 'Device', values: [{ value: mapTwoValues(this.id, 'device'), name: 'Device' }] };
  }

  override getValues(): SelectData[] {
    return Object.values(Device).map(device => ({
      value: device,
      name: device,
    }));
  }

  override getOperators(): SelectData[] {
    return [{ value: Operator.EQUALS, name: Operator.EQUALS }];
  }
}
