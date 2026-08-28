import { eventsService } from './api/events';
import { systemService } from './api/system';
import { DEMO_MODE } from './api/config';

// Centralized runtime service: single timer, subscriptions, backend-first, mock fallback
class RuntimeService {
  constructor() {
    this.subscribers = new Set();
    this.events = [];
    this.metrics = null;
    this.intervalId = null;
    this.backendAvailable = false;
  }

  async start() {
    // seed metrics
    try {
      this.metrics = await systemService.getSystemMetrics();
    } catch (e) {
      this.metrics = null;
    }

    // Demo mode deliberately stays inside the existing mock service data.
    if (DEMO_MODE) {
      this.backendAvailable = false;
      this.events = eventsService.getMockEvents().slice(0, 20);
      this.emit();
      if (!this.intervalId) {
        this.intervalId = setInterval(async () => {
          await this.tick();
        }, 3500);
      }
      return;
    }

    // try backend for live events
    try {
      const backend = await eventsService.getLiveEvents(20);
      if (backend && backend.length) {
        this.backendAvailable = true;
        this.events = backend.slice();
      } else {
        this.backendAvailable = false;
        this.events = eventsService.getMockEvents().slice(0, 20);
      }
    } catch (e) {
      this.backendAvailable = false;
      this.events = eventsService.getMockEvents().slice(0, 20);
    }

    // notify initial state
    this.emit();

    // single interval driving event updates
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        await this.tick();
      }, 3500);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async tick() {
    // if backend available, poll for new events
    if (this.backendAvailable) {
      try {
        const latest = await eventsService.getLiveEvents(20);
        // merge new events not in current list
        const existing = new Set(this.events.map(e => e.eventId));
        let added = false;
        for (const ev of latest) {
          if (!existing.has(ev.eventId)) {
            this.events.unshift(ev);
            existing.add(ev.eventId);
            added = true;
          }
        }
        if (added) this.emit();
      } catch (e) {
        // if polling fails, mark backend unavailable and fall back
        this.backendAvailable = false;
        this.events = eventsService.getMockEvents().slice(0, 20);
        this.emit();
      }
    } else {
      // simulate occasional new events from mock set
      const pool = eventsService.getMockEvents();
      const sample = pool[Math.floor(Math.random() * pool.length)];
      if (sample) {
        // create a fresh event id and timestamp
        const ev = { ...sample, eventId: `${sample.eventId}-${Date.now()}`, timestamp: new Date().toISOString() };
        // rarely escalate to block
        const r = Math.random();
        if (r > 0.985) ev.decision = 'block';
        else if (r > 0.93) ev.decision = 'pause';
        else ev.decision = sample.decision || 'allow';

        this.events.unshift(ev);
        this.events = this.events.slice(0, 200);
        this.emit(ev);
      }
    }
  }

  emit(latestEvent) {
    for (const cb of this.subscribers) cb({ events: this.events.slice(), metrics: this.metrics, latestEvent });
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    // immediately call with current state
    cb({ events: this.events.slice(), metrics: this.metrics });
    return () => this.subscribers.delete(cb);
  }

  getEvents() {
    return this.events.slice();
  }

  getMetrics() {
    return this.metrics;
  }
}

export const runtimeService = new RuntimeService();
