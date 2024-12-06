import { EventData } from 'src/event/type/event-data.type';

export type ClubDetailData = {
  id: number;
  hostId: number;
  name: string;
  description: string;
  maxPeople: number;
  clubJoin: {
    user: {
      id: number;
      name: string;
    };
  }[];
  //event: EventData[];
};
