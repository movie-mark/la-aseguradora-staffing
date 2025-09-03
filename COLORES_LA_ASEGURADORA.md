# 🎨 Paleta de Colores - La Aseguradora

## Degradado Principal

Basado en el diseño proporcionado, hemos implementado el siguiente degradado:

```css
background: linear-gradient(180deg, 
  #E64425 0%,    /* Rojo superior */
  #1f3f7d 100%   /* Azul inferior */
);
```

## Colores Sólidos Extraídos

### Colores Primarios
- **Rojo Principal**: `#E64425` (RGB: 230, 68, 37)
- **Azul Principal**: `#1f3f7d` (RGB: 31, 63, 125)

### Colores para Elementos UI

#### Botones y Enlaces
```css
/* Botón principal */
background: linear-gradient(135deg, #E64425, #1f3f7d);

/* Botón hover */
box-shadow: 0 10px 20px rgba(230, 68, 37, 0.4);
```

#### Campos de Entrada
```css
/* Focus border */
border-color: #E64425;

/* Focus shadow */
box-shadow: 0 0 0 3px rgba(230, 68, 37, 0.1);
```

#### Texto con Degradado
```css
/* Títulos principales */
background: linear-gradient(135deg, #E64425, #1f3f7d);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## Implementación en el Sistema

### 1. Fondo Principal
- **Body**: Degradado completo vertical
- **Cards**: Fondo blanco con sombras sutiles

### 2. Elementos Interactivos
- **Botones**: Degradado rojo a azul
- **Enlaces**: Color rojo principal
- **Focus**: Bordes y sombras rojas

### 3. Tipografía
- **Títulos**: Degradado de texto
- **Texto normal**: Grises neutros
- **Texto secundario**: Grises más claros

## Variaciones de Color

### Versiones Más Suaves
```css
/* Rojo suave */
#f56565

/* Azul suave */
#4299e1
```

### Versiones Más Intensas
```css
/* Rojo intenso */
#c53030

/* Azul intenso */
#1a365d
```

## Uso en CSS

### Variables CSS (Recomendado)
```css
:root {
  --color-primary-red: #E64425;
  --color-primary-blue: #1f3f7d;
  
  --gradient-main: linear-gradient(180deg, #E64425 0%, #1f3f7d 100%);
  --gradient-buttons: linear-gradient(135deg, #E64425, #1f3f7d);
  --gradient-text: linear-gradient(135deg, #E64425, #1f3f7d);
}
```

### Clases Utilitarias
```css
.bg-gradient-main { background: var(--gradient-main); }
.bg-gradient-buttons { background: var(--gradient-buttons); }
.text-gradient { background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
```

## Accesibilidad

### Contraste
- **Rojo sobre blanco**: ✅ Excelente contraste
- **Azul sobre blanco**: ✅ Excelente contraste

### Recomendaciones
- Usar colores sólidos para texto importante
- Mantener degradados solo para elementos decorativos
- Asegurar contraste mínimo de 4.5:1 para texto

## Próximos Pasos

1. **Logo**: Adaptar el logo a estos colores
2. **Iconos**: Crear iconos que complementen la paleta
3. **Animaciones**: Usar los colores en transiciones
4. **Estados**: Definir colores para hover, active, disabled