export class WApiClient {
  constructor(apiKey: string, instanceId: string, baseUrl?: string);

  getInstance(): Promise<any>;
  initInstance(): Promise<any>;
  getQrCode(): Promise<any>;
  logout(): Promise<any>;
  sendTextMessage(to: string, body: string): Promise<any>;
  sendImageMessage(to: string, caption: string, url: string): Promise<any>;
  sendFileMessage(to: string, caption: string, url: string): Promise<any>;
  sendButtonMessage(
    to: string,
    title: string,
    description: string,
    buttons: any[],
    footer?: string,
  ): Promise<any>;
  createGroup(name: string, participants: string[]): Promise<any>;
  addGroupParticipants(groupId: string, participants: string[]): Promise<any>;
  removeGroupParticipants(groupId: string, participants: string[]): Promise<any>;
  getContacts(): Promise<any>;
  getChats(): Promise<any>;
}
