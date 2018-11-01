import { Moment } from 'moment';
import { IHealthChart } from 'app/shared/model//health-chart.model';

export interface IPatient {
    id?: number;
    firstName?: string;
    lastName?: string;
    birthDate?: Moment;
    phoneNumber?: string;
    address?: string;
    healthCharts?: IHealthChart[];
}

export class Patient implements IPatient {
    constructor(
        public id?: number,
        public firstName?: string,
        public lastName?: string,
        public birthDate?: Moment,
        public phoneNumber?: string,
        public address?: string,
        public healthCharts?: IHealthChart[]
    ) {}
}
