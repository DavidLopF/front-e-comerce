export interface PaymentData {
  id: string;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentEntity {
  constructor(
    public readonly id: string,
    public readonly preferenceId: string,
    public readonly initPoint: string,
    public readonly sandboxInitPoint: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Método para crear desde datos planos
  static fromData(data: PaymentData): PaymentEntity {
    return new PaymentEntity(
      data.id,
      data.preferenceId,
      data.initPoint,
      data.sandboxInitPoint,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  // Método para convertir a datos planos
  toData(): PaymentData {
    return {
      id: this.id,
      preferenceId: this.preferenceId,
      initPoint: this.initPoint,
      sandboxInitPoint: this.sandboxInitPoint,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Método para obtener la URL correcta según el entorno
  getInitPoint(useSandbox: boolean = true): string {
    return useSandbox ? this.sandboxInitPoint : this.initPoint;
  }
}