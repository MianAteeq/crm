import { create } from 'zustand';
import { WhatsAppTemplate, TemplateButton, HeaderType, TemplateCategory } from '../types/whatsapp';

interface TemplateStore {
  currentTemplate: WhatsAppTemplate;
  setTemplateName: (name: string) => void;
  setCategory: (category: TemplateCategory) => void;
  setLanguage: (language: string) => void;
  setHeaderType: (type: HeaderType) => void;
  setHeaderText: (text: string) => void;
  setHeaderMedia: (url: string, fileName?: string, mediaPath?: string, mediaType?: string) => void;
  setHeaderMediaHandle: (handle: string) => void;
  setHeaderFileName: (fileName: string) => void;
  setHeaderVariable: (index: number, value: string) => void;
  setBodyText: (text: string) => void;
  setFooterText: (text: string) => void;
  setBodyVariable: (index: number, value: string) => void;
  addButton: (button: Omit<TemplateButton, 'id'>) => void;
  updateButton: (id: string, updates: Partial<TemplateButton>) => void;
  removeButton: (id: string) => void;
  setTemplate: (template: WhatsAppTemplate) => void;
  resetTemplate: () => void;
}

const initialTemplate: WhatsAppTemplate = {
  id: 'new',
  name: '',
  category: 'MARKETING',
  language: 'en_US',
  header: {
    type: 'NONE',
    variables: [],
  },
  body: {
    text: '',
    variables: [],
  },
  buttons: [],
  status: 'DRAFT',
  updatedAt: new Date().toISOString(),
};

export const useTemplateStore = create<TemplateStore>((set) => ({
  currentTemplate: initialTemplate,

  setTemplateName: (name) => set((state) => ({
    currentTemplate: { ...state.currentTemplate, name }
  })),

  setCategory: (category) => set((state) => ({
    currentTemplate: { ...state.currentTemplate, category }
  })),

  setLanguage: (language) => set((state) => ({
    currentTemplate: { ...state.currentTemplate, language }
  })),

  setHeaderType: (type) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      header: { ...state.currentTemplate.header, type, text: '', mediaUrl: '', mediaHandle: '', mediaPath: '', mediaType: '' } 
    }
  })),

  setHeaderText: (text) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      header: { ...state.currentTemplate.header, text } 
    }
  })),

  setHeaderMedia: (url, fileName, mediaPath, mediaType) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      header: { 
        ...state.currentTemplate.header, 
        mediaUrl: url, 
        fileName: fileName || state.currentTemplate.header.fileName,
        mediaPath: mediaPath || state.currentTemplate.header.mediaPath,
        mediaType: mediaType || state.currentTemplate.header.mediaType
      } 
    }
  })),

  setHeaderMediaHandle: (handle) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      header: { ...state.currentTemplate.header, mediaHandle: handle } 
    }
  })),

  setHeaderFileName: (fileName) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      header: { ...state.currentTemplate.header, fileName } 
    }
  })),
  
  setHeaderVariable: (index, value) => set((state) => {
    const variables = [...(state.currentTemplate.header.variables || [])];
    variables[index] = value;
    return {
      currentTemplate: {
        ...state.currentTemplate,
        header: { ...state.currentTemplate.header, variables }
      }
    };
  }),

  setBodyText: (text) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      body: { ...state.currentTemplate.body, text } 
    }
  })),

  setFooterText: (text) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      footer: text ? { text } : undefined 
    }
  })),

  setBodyVariable: (index, value) => set((state) => {
    const variables = [...state.currentTemplate.body.variables];
    variables[index] = value;
    return {
      currentTemplate: {
        ...state.currentTemplate,
        body: { ...state.currentTemplate.body, variables }
      }
    };
  }),

  addButton: (button) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      buttons: [...state.currentTemplate.buttons, { ...button, id: Math.random().toString(36).substr(2, 9) }] 
    }
  })),

  setTemplate: (template) => set({ currentTemplate: template }),

  updateButton: (id, updates) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      buttons: state.currentTemplate.buttons.map(b => b.id === id ? { ...b, ...updates } : b) 
    }
  })),

  removeButton: (id) => set((state) => ({
    currentTemplate: { 
      ...state.currentTemplate, 
      buttons: state.currentTemplate.buttons.filter(b => b.id !== id) 
    }
  })),

  resetTemplate: () => set({ currentTemplate: initialTemplate }),
}));
