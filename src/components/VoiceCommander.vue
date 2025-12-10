<script setup>
import { ref, watch } from 'vue';
import { useSpeechRecognition } from '@/composables/useSpeechRecognition';
import { useTheme } from 'vuetify';

const theme = useTheme();
const { isListening, transcript, interimTranscript, error, start, stop } = useSpeechRecognition();

const uiMessage = ref("Prem el micròfon");
const statusColor = ref("primary");
const snackbar = ref(false);
const snackbarText = ref("");

const processCommand = (text) => {
  const command = text.toLowerCase().trim();
  
  if (command.includes('saluda') || command.includes('hola')) {
    uiMessage.value = "Hola!";
    statusColor.value = "success";
  } 
  else if (command.includes('ajuda')) {
    uiMessage.value = "Digues: Hola, Mode Fosc, Esborra...";
    statusColor.value = "info";
  }
  else if (command.includes('esborra') || command.includes('borrar')) {
    uiMessage.value = "A punt";
    statusColor.value = "primary";
    transcript.value = ''; 
  }
  else if (command.includes('mode fosc')) {
     theme.global.name.value = 'dark';
     uiMessage.value = "Mode fosc";
  }
  else if (command.includes('mode clar')) {
     theme.global.name.value = 'light';
     uiMessage.value = "Mode clar";
  }
  else if (command.includes("atura't") || command.includes('para')) {
     stop();
     uiMessage.value = "Aturat";
     statusColor.value = "grey";
  }
  else {
    snackbarText.value = `No he entès: "${text}"`;
    snackbar.value = true;
  }
};

watch(transcript, (newText) => {
  if (!newText) return;
  processCommand(newText);
});
</script>

<template>
  <v-container fluid class="fill-height justify-center align-center bg-background pa-0 position-relative">
    
    <!-- Background Decor (Circles) -->
    <div class="background-shape shape-1"></div>
    <div class="background-shape shape-2"></div>

    <v-card 
        width="100%" 
        max-width="500" 
        height="100%"
        max-height="700"
        elevation="0" 
        color="transparent"
        class="d-flex flex-column align-center justify-center pa-8 position-relative z-index-1"
    >
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-h3 font-weight-light mb-2 text-high-emphasis">
          Voice Control
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis font-weight-light">
          Assistent personal
        </p>
      </div>

      <!-- Main Action (Mic) -->
      <div class="mb-12 relative d-flex justify-center align-center" style="height: 200px;">
           <v-btn
              icon
              width="120"
              height="120"
              :color="isListening ? 'error' : 'primary'"
              elevation="8"
              class="mic-btn transition-swing"
              :class="{'is-listening': isListening}"
              @click="isListening ? stop() : start()"
           >
              <v-icon size="50" color="white">
                {{ isListening ? 'mdi-microphone' : 'mdi-microphone-off' }}
              </v-icon>
           </v-btn>
           
           <!-- Ripple Rings (CSS handles animation) -->
           <div v-if="isListening" class="pulse-ring"></div>
           <div v-if="isListening" class="pulse-ring delay-1"></div>
      </div>
      
      <!-- Status & Feedback -->
      <div class="text-center w-100" style="min-height: 100px;">
          <transition name="fade-slide" mode="out-in">
            <h2 :key="uiMessage" class="text-h4 font-weight-regular mb-2 text-high-emphasis">
               {{ uiMessage }}
            </h2>
          </transition>
          
          <div class="d-flex justify-center align-center" style="height: 24px;">
            <p v-if="isListening && !interimTranscript" class="text-caption text-disabled fade-pulse">
                Escoltant...
            </p>
            <p v-else-if="interimTranscript" class="text-body-1 text-primary font-italic">
                "{{ interimTranscript }}..."
            </p>
          </div>
      </div>

      <!-- Footer / Commands -->
      <div class="mt-auto pt-8 w-100 overflow-x-auto d-flex justify-center">
         <div class="d-flex gap-2">
            <v-chip v-for="cmd in ['Hola', 'Mode Fosc', 'Mode Clar', 'Atura\'t']" 
                :key="cmd"
                variant="outlined" 
                class="border-opacity-25"
                color="on-surface"
            >
                {{ cmd }}
            </v-chip>
         </div>
      </div>
      
      <!-- Error Alert -->
       <v-expand-transition>
            <div v-if="error" class="position-absolute top-0 w-100 pa-4 mt-16">
                 <v-alert type="error" variant="tonal" density="compact" closable>{{ error }}</v-alert>
            </div>
        </v-expand-transition>

    </v-card>

    <v-snackbar v-model="snackbar" color="surface-variant" content-class="text-on-surface-variant text-center" timeout="2000" location="bottom" rounded="pill" elevation="0">
      <span class="text-body-2">{{ snackbarText }}</span>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
/* Layout Utilities */
.gap-2 { gap: 8px; }
.z-index-1 { z-index: 1; }

/* Mic Button & Pulse */
.mic-btn {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 2;
}

.mic-btn.is-listening {
    transform: scale(1.1);
}

.pulse-ring {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: rgb(var(--v-theme-error));
    opacity: 0.2;
    animation: ripple 2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 1;
}

.pulse-ring.delay-1 {
    animation-delay: 0.6s;
}

@keyframes ripple {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(2.5); opacity: 0; }
}

/* Text Animations */
.fade-pulse {
    animation: text-pulse 1.5s infinite ease-in-out;
}

@keyframes text-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* Background Shapes */
.background-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.4;
}

.shape-1 {
    top: -10%;
    left: -10%;
    width: 50vw;
    height: 50vw;
    background: radial-gradient(circle, rgb(var(--v-theme-primary)) 0%, transparent 70%);
}

.shape-2 {
    bottom: -10%;
    right: -10%;
    width: 40vw;
    height: 40vw;
    background: radial-gradient(circle, rgb(var(--v-theme-secondary)) 0%, transparent 70%);
}

/* Vue Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
