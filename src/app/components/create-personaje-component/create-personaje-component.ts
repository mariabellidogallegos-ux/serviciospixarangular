import { Component, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { ServicePersonajes } from '../../services/service.personajes';
import { Personaje } from '../../models/personaje';

@Component({
  selector: 'app-create-personaje-component',
  standalone: false,
  styleUrl: './create-personaje-component.css',
  templateUrl: './create-personaje-component.html',
})
export class CreatePersonajeComponent {
  @ViewChild("cajaid") cajaid!: ElementRef<HTMLInputElement>;
  @ViewChild("cajanombre") cajanombre!: ElementRef<HTMLInputElement>;
  @ViewChild("cajaimagen") cajaimagen!: ElementRef<HTMLInputElement>;
  @ViewChild("cajapelicula") cajapelicula!: ElementRef<HTMLInputElement>;

  mensaje = signal<string>('');
  isLoading = signal<boolean>(false);
  mensajeType = signal<'success' | 'error' | ''>('');
  imagenPreviewUrl = signal<string | null>(null);
  imagenPreviewFailed = signal<boolean>(false);

  // Validation error signals
  idError = signal<string>('');
  nombreError = signal<string>('');
  imagenError = signal<string>('');
  peliculaError = signal<string>('');

  constructor(
    private _service: ServicePersonajes
  ) {}

  // Computed progress percentage
  progressPercent = computed(() => {
    let filled = 0;
    if (this.cajaid?.nativeElement?.value?.trim()) filled++;
    if (this.cajanombre?.nativeElement?.value?.trim()) filled++;
    if (this.cajaimagen?.nativeElement?.value?.trim()) filled++;
    if (this.cajapelicula?.nativeElement?.value?.trim()) filled++;
    return (filled / 4) * 100;
  });

  // Preview computed values
  previewId = computed(() => this.cajaid?.nativeElement?.value?.trim() || '');
  previewNombre = computed(() => this.cajanombre?.nativeElement?.value?.trim() || '');
  previewPelicula = computed(() => this.cajapelicula?.nativeElement?.value?.trim() || '');

  hasAnyInput = computed(() => {
    return !!(this.previewId() || this.previewNombre() || this.imagenPreviewUrl() || this.previewPelicula());
  });

  imagenPreview = computed(() => {
    if (this.imagenPreviewFailed()) return null;
    return this.imagenPreviewUrl();
  });

  // Input handlers with validation
  onIdInput(): void {
    const value = this.cajaid?.nativeElement?.value?.trim() || '';
    this.idError.set('');
    if (value && (isNaN(parseInt(value, 10)) || parseInt(value, 10) <= 0)) {
      this.idError.set('El ID debe ser un número positivo');
    }
  }

  onNombreInput(): void {
    const value = this.cajanombre?.nativeElement?.value?.trim() || '';
    this.nombreError.set('');
    if (value && value.length < 2) {
      this.nombreError.set('El nombre debe tener al menos 2 caracteres');
    }
  }

  onImagenInput(): void {
    const value = this.cajaimagen?.nativeElement?.value?.trim() || '';
    this.imagenError.set('');
    this.imagenPreviewFailed.set(false);

    if (value) {
      // Basic URL validation
      try {
        new URL(value);
        this.imagenPreviewUrl.set(value);
      } catch {
        this.imagenError.set('Introduce una URL válida (ej: https://...)');
        this.imagenPreviewUrl.set(null);
      }
    } else {
      this.imagenPreviewUrl.set(null);
    }
  }

  onPeliculaInput(): void {
    const value = this.cajapelicula?.nativeElement?.value?.trim() || '';
    this.peliculaError.set('');
    if (value && value.length < 2) {
      this.peliculaError.set('El nombre de la película es muy corto');
    }
  }

  onPreviewError(): void {
    this.imagenPreviewFailed.set(true);
    this.imagenPreviewUrl.set(null);
  }

  async insertarPersonaje(): Promise<void> {
    const id = parseInt(this.cajaid?.nativeElement?.value || '0', 10);
    const nombre = this.cajanombre?.nativeElement?.value?.trim() || '';
    const imagen = this.cajaimagen?.nativeElement?.value?.trim() || '';
    const pelicula = this.cajapelicula?.nativeElement?.value?.trim() || '';

    // Validation
    let hasError = false;

    if (!id || id <= 0) {
      this.idError.set('El ID debe ser un número positivo');
      hasError = true;
    }
    if (!nombre) {
      this.nombreError.set('El nombre es obligatorio');
      hasError = true;
    } else if (nombre.length < 2) {
      this.nombreError.set('El nombre debe tener al menos 2 caracteres');
      hasError = true;
    }
    if (!imagen) {
      this.imagenError.set('La URL de la imagen es obligatoria');
      hasError = true;
    } else {
      try {
        new URL(imagen);
      } catch {
        this.imagenError.set('Introduce una URL válida');
        hasError = true;
      }
    }
    if (!pelicula) {
      this.peliculaError.set('La película es obligatoria');
      hasError = true;
    } else if (pelicula.length < 2) {
      this.peliculaError.set('El nombre de la película es muy corto');
      hasError = true;
    }

    if (hasError) {
      this.mensaje.set('Por favor corrige los errores del formulario');
      this.mensajeType.set('error');
      return;
    }

    this.isLoading.set(true);
    this.mensaje.set('');

    try {
      const personaje = new Personaje(id, nombre, imagen, pelicula);
      await this._service.insertPersonaje(personaje);
      this.mensaje.set(`✓ Personaje "${nombre}" creado correctamente`);
      this.mensajeType.set('success');
      this.resetForm();
    } catch (error) {
      this.mensaje.set('Error al crear el personaje. Inténtalo de nuevo.');
      this.mensajeType.set('error');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private resetForm(): void {
    this.cajaid.nativeElement.value = '';
    this.cajanombre.nativeElement.value = '';
    this.cajaimagen.nativeElement.value = '';
    this.cajapelicula.nativeElement.value = '';
    this.imagenPreviewUrl.set(null);
    this.imagenPreviewFailed.set(false);
    this.idError.set('');
    this.nombreError.set('');
    this.imagenError.set('');
    this.peliculaError.set('');
  }
}
