import { Component, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { ServicePersonajes } from '../../services/service.personajes';
import { Personaje } from '../../models/personaje';

@Component({
  selector: 'app-delete-from-component',
  standalone: false,
  styleUrl: './delete-from-component.css',
  templateUrl: './delete-from-component.html',
})
export class DeleteFromComponent {
  @ViewChild("cajaid") cajaid!: ElementRef<HTMLInputElement>;

  mensaje = signal<string>('');
  mensajeType = signal<'success' | 'error' | 'info' | ''>('');
  isLoading = signal<boolean>(false);
  idError = signal<string>('');

  // Preview of character to be deleted (fetched from API)
  personajePreview = signal<Personaje | null>(null);
  previewLoading = signal<boolean>(false);

  constructor(
    private _service: ServicePersonajes
  ) {}

  // Computed: check if input has value
  hasInput = computed(() => {
    return !!(this.cajaid?.nativeElement?.value?.trim());
  });

  // Computed: validate ID
  isValidId = computed(() => {
    const value = this.cajaid?.nativeElement?.value?.trim() || '';
    if (!value) return false;
    const id = parseInt(value, 10);
    return !isNaN(id) && id > 0;
  });

  // Input handler with validation and preview fetch
  onIdInput(): void {
    const value = this.cajaid?.nativeElement?.value?.trim() || '';
    this.idError.set('');
    this.personajePreview.set(null);

    if (value) {
      const id = parseInt(value, 10);
      if (isNaN(id) || id <= 0) {
        this.idError.set('El ID debe ser un número positivo');
        return;
      }

      // Fetch preview
      this.fetchPreview(id);
    }
  }

  private async fetchPreview(id: number): Promise<void> {
    this.previewLoading.set(true);
    try {
      const personajes = await this._service.getPersonajesAsync();
      const found = personajes.find(p => p.idPersonaje === id);
      this.personajePreview.set(found || null);
    } catch (error) {
      console.error('Error fetching preview:', error);
      this.personajePreview.set(null);
    } finally {
      this.previewLoading.set(false);
    }
  }

  async eliminarPersonaje(): Promise<void> {
    const value = this.cajaid?.nativeElement?.value?.trim() || '';
    const id = parseInt(value, 10);

    // Validation
    if (!value || isNaN(id) || id <= 0) {
      this.idError.set('Introduce un ID válido (número positivo)');
      this.mensaje.set('Por favor corrige el ID');
      this.mensajeType.set('error');
      return;
    }

    this.isLoading.set(true);
    this.mensaje.set('');
    this.mensajeType.set('');

    try {
      await this._service.deletePersonaje(id);
      const nombre = this.personajePreview()?.nombre || `ID ${id}`;
      this.mensaje.set(`✓ Personaje "${nombre}" (ID: ${id}) eliminado correctamente`);
      this.mensajeType.set('success');
      this.resetForm();
    } catch (error) {
      this.mensaje.set(`Error al eliminar el personaje ID ${id}. Verifica que existe.`);
      this.mensajeType.set('error');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private resetForm(): void {
    this.cajaid.nativeElement.value = '';
    this.personajePreview.set(null);
    this.idError.set('');
  }

  onPreviewError(): void {
    // The preview component handles this internally
    // Could trigger a re-fetch or show placeholder
  }
}