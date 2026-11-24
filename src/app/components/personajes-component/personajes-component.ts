import { Component, OnInit, signal, computed } from '@angular/core';
import { ServicePersonajes } from '../../services/service.personajes';
import { Personaje } from '../../models/personaje';

interface MovieCount {
  movie: string;
  count: number;
}

@Component({
  selector: 'app-personajes-component',
  standalone: false,
  styleUrl: './personajes-component.css',
  templateUrl: './personajes-component.html',
})
export class PersonajesComponent implements OnInit {
  personajes = signal<Personaje[]>([]);

  // Chart dimensions
  readonly marginLeft = 60;
  readonly marginRight = 20;
  readonly marginBottom = 60;
  readonly chartWidth = 700;
  readonly chartHeight = 350;

  constructor(
    private _service: ServicePersonajes
  ) {}

  async ngOnInit(): Promise<void> {
    const data = await this._service.getPersonajesAsync();
    this.personajes.set(data);
  }

  // Computed: characters grouped by movie
  movieData = computed<MovieCount[]>(() => {
    const counts = new Map<string, number>();
    for (const p of this.personajes()) {
      counts.set(p.pelicula, (counts.get(p.pelicula) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([movie, count]) => ({ movie, count }))
      .sort((a, b) => b.count - a.count);
  });

  // Chart scales
  maxCount = computed(() => Math.max(...this.movieData().map(d => d.count), 1));
  plotHeight = computed(() => this.chartHeight - this.marginBottom - 40);
  yScale = computed(() => this.plotHeight() / this.maxCount());
  barWidth = computed(() => Math.max(32, (this.chartWidth - this.marginLeft - this.marginRight) / this.movieData().length - 16));

  // Y-axis ticks
  yTicks = computed(() => {
    const max = this.maxCount();
    const step = Math.ceil(max / 4);
    const ticks = [];
    for (let i = 0; i <= max; i += step) {
      const y = this.chartHeight - this.marginBottom - i * this.yScale();
      ticks.push({ value: i, y });
    }
    return ticks;
  });

  // Bar positions
  barX = (index: number): number => {
    const bw = this.barWidth();
    return this.marginLeft + index * (bw + 16) + 8;
  };

  barY = (count: number): number => {
    return this.chartHeight - this.marginBottom - count * this.yScale();
  };

  barHeight = (count: number): number => {
    return count * this.yScale();
  };

  // Categorical colors from dataviz palette (8 slots, fixed order)
  private readonly categoricalColors = [
    '#2a78d6', // blue
    '#eb6834', // orange
    '#1baf7a', // aqua
    '#eda100', // yellow
    '#e87ba4', // magenta
    '#008300', // green
    '#6250d6', // violet
    '#e34948', // red
  ];

  barColor = (index: number): string => {
    return this.categoricalColors[index % this.categoricalColors.length];
  };

  truncateMovieName = (name: string): string => {
    if (name.length > 18) return name.slice(0, 16) + '…';
    return name;
  };

  onImageError = (event: Event): void => {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e1e0d9" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" font-family="system-ui" font-size="12" fill="%23898781"%3ESin imagen%3C/text%3E%3C/svg%3E';
  };
}