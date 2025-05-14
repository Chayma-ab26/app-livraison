import { Component } from '@angular/core';
import { DeepseekService } from './../../../core/services/deepseek.service';

@Component({
  selector: 'app-chatbot',
  standalone:false,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { sender: 'user' | 'bot', text: string }[] = [];
  userInput = '';
  loading = false;
  isOpen: boolean = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  constructor(private ai: DeepseekService) {}

  ngOnInit(): void {
    this.messages.push({
      sender: 'bot',
      text: '👋 Bonjour chauffeur ! Je suis ton assistant routier. Pose-moi une question sur ton trajet, la météo ou le trafic.'
    });
  }

  async sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;

    this.messages.push({ sender: 'user', text: input });
    this.userInput = '';
    this.loading = true;

    try {
      const reply = await this.ai.askBot(input);
      this.messages.push({ sender: 'bot', text: reply });
    } catch {
      this.messages.push({ sender: 'bot', text: "Une erreur s'est produite." });
    } finally {
      this.loading = false;
    }
  }
}
