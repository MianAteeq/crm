export interface Template {
  id: string;
  name: string;
  displayName: string;
  category: 'Marketing' | 'Utility' | 'Authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  edited: string;
  rejectReason?: string;
  header: {
    type: 'none' | 'text' | 'image' | 'video' | 'document';
    text?: string;
    mediaUrl?: string;
  };
  body: {
    text: string;
    variables: { label: string; sample: string }[];
  };
  footer?: {
    text: string;
  };
  buttons: {
    type: 'none' | 'cta' | 'quick_reply' | 'mixed';
    cta?: { type: 'url' | 'phone' | 'copy'; label: string; value: string }[];
    quickReplies?: { text: string }[];
  };
}

export const templates: Template[] = [
  {
    id: '1',
    name: "eid_special_offer",
    displayName: "Eid Special Offer",
    category: "Marketing",
    language: "en",
    status: "approved",
    edited: "2 days ago",
    header: { type: "text", text: "Sparkle this Eid! ✨" },
    body: {
      text: "Hello *{{1}}*! Celebrate this Eid with a fresh glow. Get *20% OFF* on all facial treatments at throbtech Clinic. Use code EID20.",
      variables: [{ label: "Customer Name", sample: "Sara" }]
    },
    footer: { text: "Offers valid until end of Eid." },
    buttons: {
      type: "quick_reply",
      quickReplies: [{ text: "Book Now" }, { text: "View Services" }, { text: "Stop" }]
    }
  },
  {
    id: '2',
    name: "appointment_reminder",
    displayName: "Appointment Reminder",
    category: "Utility",
    language: "en",
    status: "approved",
    edited: "5 days ago",
    header: { type: "image", mediaUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop" },
    body: {
      text: "Hi *{{1}}*, this is a friendly reminder for your appointment on *{{2}}* at *{{3}}*. We look forward to seeing you!",
      variables: [
        { label: "Customer Name", sample: "Emma" },
        { label: "Date", sample: "Oct 24th" },
        { label: "Time", sample: "2:30 PM" }
      ]
    },
    footer: { text: "Please arrive 10 mins early." },
    buttons: {
      type: "cta",
      cta: [{ type: "phone", label: "Call Clinic", value: "+15550123456" }],
      quickReplies: []
    }
  },
  {
    id: '3',
    name: "rejected_promo",
    displayName: "Winter Sale Rejected",
    category: "Marketing",
    language: "en",
    status: "rejected",
    edited: "3 days ago",
    rejectReason: "Template contains content that violates WhatsApp Business Messaging Policy 4.2 regarding health claims.",
    header: { type: "none" },
    body: {
      text: "This treatment will *cure* all your skin problems permanently! Book now for 90% off.",
      variables: []
    },
    buttons: {
      type: "none"
    }
  },
  {
    id: '4',
    name: "login_otp",
    displayName: "Standard OTP",
    category: "Authentication",
    language: "en",
    status: "pending",
    edited: "1 hour ago",
    header: { type: "none" },
    body: {
      text: "Your throbtech login code is *{{1}}*. Do not share this code.",
      variables: [{ label: "OTP", sample: "459021" }]
    },
    buttons: {
      type: "cta",
      cta: [{ type: "copy", label: "Copy Code", value: "{{1}}" }]
    }
  }
];

export const systemTemplates: Partial<Template>[] = [
  {
    id: 'sys_1',
    displayName: "Order Confirmation",
    category: "Utility",
    body: {
      text: "Hi {{1}}, your order #{{2}} has been confirmed!",
      variables: [{ label: "Name", sample: "John" }, { label: "Order ID", sample: "12345" }]
    },
    buttons: { type: "cta", cta: [{ type: "url", label: "Track Order", value: "https://zappify.io/track" }] }
  },
  {
    id: 'sys_2',
    displayName: "Welcome Message",
    category: "Marketing",
    body: {
      text: "Welcome to throbtech, {{1}}! We are thrilled to have you here.",
      variables: [{ label: "Name", sample: "Alex" }]
    }
  }
];
