export interface Event {
  id: string;
  created_at: string;
  owner_id: string;
  owner_email: string;
  name: string;
  description: string;
  remote_viewing_instructions: string;
}

export interface EventSession {
  id: string;
  created_at: string;
  description: string;
  event_id: string;
  remote_viewer_id: string;
  remote_viewer_email: string;
}

export interface EventResolution {
  id: string;
  created_at: string;
  event_id: string;
  event_outcome_id: string;
  picture_base64: string;
}

export interface EventOutcomePrediction {
  id: string;
  created_at: string;
  event_id: string;
  best_matching_outcome_id: string;
  matching_percentage: number;
}

export interface EventOutcome {
  id: string;
  created_at: string;
  event_id: string;
  description: string;
  picture_description: string;
}

export interface UserRemoteViewer {
  user_id: string;
  remote_viewer_email: string;
  created_at: string;
}
