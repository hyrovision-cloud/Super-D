import { httpClient } from './httpClient';

export interface ApplicationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  soundAlerts: boolean;
  currency: 'INR';
  dateFormat: 'DD-MM-YYYY' | 'DD.MM.YYYY' | 'YYYY-MM-DD';
  attendanceStatuses: Array<{ code: string; label: string; enabled: boolean }>;
}

export const configApi = {
  getApplication: () => httpClient.get<ApplicationSettings>('/config/application'),
  updateApplication: (settings: Partial<ApplicationSettings>) => httpClient.patch<ApplicationSettings>('/config/application', settings),
};
