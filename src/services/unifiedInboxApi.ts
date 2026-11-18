import { apiClient } from './apiClient';

export type InboxChannel='whatsapp'|'facebook'|'instagram';
export type InboxView='team'|'mine'|'unread'|'starred'|'following'|'recent'|'others'|'unassigned'|'sla_overdue';

export interface InboxConversation {
  channel:InboxChannel; source_id:number; contact_id?:number|null; display_name:string; external_id?:string; avatar_url?:string;
  last_message?:string; last_message_at?:string; unread_count:number; is_unread:boolean; status:'open'|'pending'|'resolved'; priority:'low'|'normal'|'high'|'urgent';
  assigned_to_user_id?:number|null; assigned_to_name?:string|null; is_starred:boolean; is_following:boolean; identity_status:'linked'|'unresolved';
  sla_status?:'running'|'warning'|'overdue'|'met'|'paused'|'inactive'|null; sla_due_at?:string|null; sla_started_at?:string|null;
  can_send_freeform?:boolean; send_restriction?:string|null; is_auto_reply_active?:boolean;
}

export interface InboxMessage { id:number; provider_id?:string; direction:'inbound'|'outbound'; body?:string; type:string; status?:string; timestamp:string; attachment?:{url:string;mime_type?:string;file_name?:string}|null }
export interface InboxNote { id:number; content:string; created_at:string; user?:{id:number;name:string;avatar?:string} }

export const unifiedInboxApi={
  bootstrap:()=>apiClient.get('/inbox/bootstrap',{headers:{'X-Skip-Loader':'true'}}).then(r=>r.data),
  conversations:(params:any)=>apiClient.get('/inbox/conversations',{params,headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  detail:(channel:InboxChannel,id:number)=>apiClient.get(`/inbox/conversations/${channel}/${id}`,{headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  updateState:(channel:InboxChannel,id:number,data:any)=>apiClient.patch(`/inbox/conversations/${channel}/${id}/state`,data,{headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  addNote:(channel:InboxChannel,id:number,content:string)=>apiClient.post(`/inbox/conversations/${channel}/${id}/notes`,{content}).then(r=>r.data),
  snippets:(search='')=>apiClient.get('/inbox/snippets',{params:{search},headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  saveSnippet:(data:any)=>apiClient.post('/inbox/snippets',data).then(r=>r.data),
  deleteSnippet:(id:number)=>apiClient.delete(`/inbox/snippets/${id}`).then(r=>r.data),
  renderSnippet:(channel:InboxChannel,id:number,snippet_id:number)=>apiClient.post(`/inbox/conversations/${channel}/${id}/render-snippet`,{snippet_id},{headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  saveSlaPolicy:(data:any)=>apiClient.put('/inbox/sla-policies',data).then(r=>r.data),
  slaReport:(channel:InboxChannel='whatsapp')=>apiClient.get('/inbox/sla-report',{params:{channel},headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
  createTask:(channel:InboxChannel,id:number,data:any)=>apiClient.post(`/inbox/conversations/${channel}/${id}/tasks`,data).then(r=>r.data),
  sendText:(channel:InboxChannel,id:number,message:string)=>channel==='whatsapp'
    ? apiClient.post('/messages/send',{conversation_id:id,message},{headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data)
    : apiClient.post(`/v1/social/inbox/conversations/${id}/messages`,{message},{headers:{'X-Skip-Loader':'true','X-Skip-Toast':'true'}}).then(r=>r.data),
};

