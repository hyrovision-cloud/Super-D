import { Notification } from '@/types';

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    _id: 'notif-01',
    title: 'New Leave Request',
    message: 'Sister Shanthi Edward submitted a casual leave request for 23-09-2024 to 25-09-2024.',
    type: 'INFO',
    read: false,
    createdAt: '2024-09-19T11:20:00.000Z',
    link: '/leave',
  },
  {
    _id: 'notif-02',
    title: 'SLA Escalation Alert',
    message: 'Case TKT-24-007 (Ambulance delay) has exceeded the 6-hour critical response SLA.',
    type: 'CRITICAL',
    read: false,
    createdAt: '2024-09-19T14:05:00.000Z',
    link: '/complaints',
  },
  {
    _id: 'notif-03',
    title: 'Emergency Admission',
    message: 'Patient A. Mohammed Farooq checked into Trichy Emergency Care Department.',
    type: 'WARNING',
    read: true,
    createdAt: '2024-09-20T11:30:00.000Z',
    link: '/patients/pat-1015',
  },
  {
    _id: 'notif-04',
    title: 'Daily Revenue Target Reached',
    message: 'Chennai branch crossed ₹2,00,000 collections for today.',
    type: 'SUCCESS',
    read: true,
    createdAt: '2024-09-20T12:35:00.000Z',
    link: '/finance',
  },
];
