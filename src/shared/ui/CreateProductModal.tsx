"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Trash2,
  ImageIcon,
  DollarSign,
  Package,
  Tag,
  FileText,
  Layers,
  Percent,
  AlertCircle,
  Check,
  ChevronDown,
} from "lucide-react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: ProductFormData) => void;
}

interface ProductFormData {
  nombre: string;
  descripcion: string;
  sku: string;
  categoria: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  estado: "activo" | "inactivo" | "borrador";
  imagenes: string[];
  variantes: Variante[];
  peso?: number;
  dimensiones?: {
    largo: number;
    ancho: number;
    alto: number;
  };
  etiquetas: string[];
}

interface Variante {
  id: string;
  nombre: string;
  opciones: string[];
}

const categorias = [
  { id: "ropa", nombre: "Ropa", icono: "👕" },
  { id: "calzado", nombre: "Calzado", icono: "👟" },
  { id: "accesorios", nombre: "Accesorios", icono: "🎒" },
  { id: "electronica", nombre: "Electrónica", icono: "📱" },
  { id: "hogar", nombre: "Hogar", icono: "🏠" },
  { id: "deportes", nombre: "Deportes", icono: "⚽" },
];

export default function CreateProductModal({
  isOpen,
  onClose,
  onSave,
}: CreateProductModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "media" | "inventario" | "variantes">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    sku: "",
    categoria: "",
    precio: 0,
    precioOferta: undefined,
    stock: 0,
    estado: "borrador",
    imagenes: [],
    variantes: [],
    peso: undefined,
    dimensiones: undefined,
    etiquetas: [],
  });

  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Imágenes de preview (mockup)
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleAddImage = () => {
    // Mockup: Simular agregar imagen
    const mockImages = [
      "https://via.placeholder.com/200x200/3b82f6/ffffff?text=Producto+1",
      "https://via.placeholder.com/200x200/10b981/ffffff?text=Producto+2",
      "https://via.placeholder.com/200x200/f59e0b/ffffff?text=Producto+3",
      "https://via.placeholder.com/200x200/8b5cf6/ffffff?text=Producto+4",
    ];
    if (previewImages.length < 4) {
      setPreviewImages((prev) => [...prev, mockImages[prev.length]]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !formData.etiquetas.includes(nuevaEtiqueta.trim())) {
      setFormData((prev) => ({
        ...prev,
        etiquetas: [...prev.etiquetas, nuevaEtiqueta.trim()],
      }));
      setNuevaEtiqueta("");
    }
  };

  const handleRemoveEtiqueta = (etiqueta: string) => {
    setFormData((prev) => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((e) => e !== etiqueta),
    }));
  };

  const handleAddVariante = () => {
    const nuevaVariante: Variante = {
      id: Date.now().toString(),
      nombre: "",
      opciones: [""],
    };
    setFormData((prev) => ({
      ...prev,
      variantes: [...prev.variantes, nuevaVariante],
    }));
  };

  const handleVarianteChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleAddOpcion = (varianteId: string) => {
    setFormData((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        v.id === varianteId ? { ...v, opciones: [...v.opciones, ""] } : v
      ),
    }));
  };

  const handleOpcionChange = (varianteId: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        v.id === varianteId
          ? {
              ...v,
              opciones: v.opciones.map((o, i) => (i === index ? value : o)),
            }
          : v
      ),
    }));
  };

  const handleRemoveVariante = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variantes: prev.variantes.filter((v) => v.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "El SKU es requerido";
    }
    if (!formData.categoria) {
      newErrors.categoria = "Selecciona una categoría";
    }
    if (formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }
    if (formData.precioOferta && formData.precioOferta >= formData.precio) {
      newErrors.precioOferta = "El precio de oferta debe ser menor al precio normal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setActiveTab("general");
      return;
    }

    setIsSubmitting(true);
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (onSave) {
      onSave(formData);
    }
    
    setIsSubmitting(false);
    onClose();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-CO").format(value);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "general", label: "Información General", icon: FileText },
    { id: "media", label: "Imágenes", icon: ImageIcon },
    { id: "inventario", label: "Inventario", icon: Package },
    { id: "variantes", label: "Variantes", icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Producto</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Complete la información del producto
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6 bg-white">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
            {/* Tab: Información General */}
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Camiseta Premium Negra"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe las características del producto..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* SKU y Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Ej: CAM-001"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                          errors.sku ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {errors.sku && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.sku}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                          errors.categoria ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icono} {cat.nombre}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.categoria && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.categoria}
                      </p>
                    )}
                  </div>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="precio"
                        value={formData.precio > 0 ? formatPrice(formData.precio) : ""}
                        onChange={handlePriceChange}
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.precio ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        COP
                      </span>
                    </div>
                    {errors.precio && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.precio}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio de Oferta
                      <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      <input
                        type="text"
                        name="precioOferta"
                        value={formData.precioOferta ? formatPrice(formData.precioOferta) : ""}
                        onChange={handlePriceChange}
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.precioOferta ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        COP
                      </span>
                    </div>
                    {errors.precioOferta && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.precioOferta}
                      </p>
                    )}
                    {formData.precioOferta && formData.precio > 0 && formData.precioOferta < formData.precio && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        {Math.round(((formData.precio - formData.precioOferta) / formData.precio) * 100)}% de descuento
                      </p>
                    )}
                  </div>
                </div>

                {/* Etiquetas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={nuevaEtiqueta}
                      onChange={(e) => setNuevaEtiqueta(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEtiqueta())}
                      placeholder="Agregar etiqueta..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddEtiqueta}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.etiquetas.map((etiqueta) => (
                      <span
                        key={etiqueta}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {etiqueta}
                        <button
                          onClick={() => handleRemoveEtiqueta(etiqueta)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Producto
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "activo", label: "Activo", color: "green" },
                      { value: "inactivo", label: "Inactivo", color: "gray" },
                      { value: "borrador", label: "Borrador", color: "yellow" },
                    ].map((estado) => (
                      <button
                        key={estado.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, estado: estado.value as ProductFormData["estado"] }))}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                          formData.estado === estado.value
                            ? estado.color === "green"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : estado.color === "gray"
                              ? "border-gray-500 bg-gray-50 text-gray-700"
                              : "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              estado.color === "green"
                                ? "bg-green-500"
                                : estado.color === "gray"
                                ? "bg-gray-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          {estado.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Imágenes */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes del Producto
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Agrega hasta 4 imágenes. La primera será la imagen principal.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Preview de imágenes */}
                    {previewImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Producto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            Principal
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Botón agregar imagen */}
                    {previewImages.length < 4 && (
                      <button
                        onClick={handleAddImage}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
                      >
                        <Upload className="w-8 h-8" />
                        <span className="text-sm font-medium">Agregar</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {/* Guía de imágenes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Recomendaciones para las imágenes:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Tamaño recomendado: 800x800 píxeles</li>
                    <li>• Formato: JPG, PNG o WebP</li>
                    <li>• Peso máximo: 5MB por imagen</li>
                    <li>• Fondo blanco o neutro preferible</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Inventario */}
            {activeTab === "inventario" && (
              <div className="space-y-6">
                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad en Stock
                  </label>
                  <div className="relative max-w-xs">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stock: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="0"
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      unidades
                    </span>
                  </div>
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso del Producto
                    <span className="text-gray-400 font-normal ml-1">(para calcular envío)</span>
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      name="peso"
                      value={formData.peso || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          peso: parseFloat(e.target.value) || undefined,
                        }))
                      }
                      min="0"
                      step="0.1"
                      placeholder="0.0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      kg
                    </span>
                  </div>
                </div>

                {/* Dimensiones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensiones del Paquete
                    <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Largo</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          cm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ancho</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          cm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Alto</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          cm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alertas de stock */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Configurar Alerta de Stock Bajo
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Recibe una notificación cuando el stock sea menor a:
                  </p>
                  <div className="relative max-w-[150px]">
                    <input
                      type="number"
                      defaultValue={10}
                      min="1"
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      unidades
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Variantes */}
            {activeTab === "variantes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Variantes del Producto</h3>
                    <p className="text-sm text-gray-500">
                      Agrega opciones como tallas, colores, etc.
                    </p>
                  </div>
                  <button
                    onClick={handleAddVariante}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Variante
                  </button>
                </div>

                {formData.variantes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No hay variantes configuradas</p>
                    <p className="text-sm text-gray-400">
                      Las variantes te permiten ofrecer diferentes opciones del mismo producto
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.variantes.map((variante) => (
                      <div
                        key={variante.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 mr-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre de la Variante
                            </label>
                            <input
                              type="text"
                              value={variante.nombre}
                              onChange={(e) =>
                                handleVarianteChange(variante.id, "nombre", e.target.value)
                              }
                              placeholder="Ej: Talla, Color, Material..."
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveVariante(variante.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opciones
                          </label>
                          <div className="space-y-2">
                            {variante.opciones.map((opcion, oIndex) => (
                              <div key={oIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={opcion}
                                  onChange={(e) =>
                                    handleOpcionChange(variante.id, oIndex, e.target.value)
                                  }
                                  placeholder={`Opción ${oIndex + 1}`}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleAddOpcion(variante.id)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Agregar opción
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ejemplo de variantes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Ejemplo de variantes:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• <strong>Talla:</strong> S, M, L, XL</p>
                    <p>• <strong>Color:</strong> Negro, Blanco, Azul</p>
                    <p>• <strong>Material:</strong> Algodón, Poliéster</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setFormData((prev) => ({ ...prev, estado: "borrador" }))}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
              >
                Guardar como Borrador
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Crear Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
