# UI Components Guide

## Installation

All UI components are exported from `@/components/ui`:

```tsx
import { Button, Alert, Input } from '@/components/ui';
```

## Button

### Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Loading State

```tsx
<Button isLoading>Processing...</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'danger' \| 'ghost' | 'primary' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Shows loading spinner |
| disabled | boolean | false | Disables the button |
| children | ReactNode | - | Button content |

---

## Alert

### Variants

```tsx
<Alert variant="success">Success message</Alert>
<Alert variant="error">Error message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="info">Info message</Alert>
```

### With Title

```tsx
<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>
```

### With Close Button

```tsx
<Alert variant="error" onClose={() => setShow(false)}>
  Something went wrong.
</Alert>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | Alert style variant |
| title | string | - | Optional title |
| children | ReactNode | - | Alert message content |
| onClose | () => void | - | Close callback |
| className | string | - | Additional CSS classes |

---

## Input

### Basic Usage

```tsx
<Input placeholder="Enter your name" />
```

### With Label

```tsx
<Input label="Full Name" placeholder="Enter your name" />
```

### With Error

```tsx
<Input label="Email" type="email" error="Invalid email address" />
```

### With Icon

```tsx
import { Mail } from 'lucide-react';

<Input label="Email" type="email" icon={Mail} placeholder="email@example.com" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label |
| error | string | - | Error message |
| icon | ElementType | - | Icon component |
| ... | InputHTMLAttributes | - | Standard input props |

---

## Design Tokens

For consistent styling across the app, use the design tokens:

```tsx
import { standardClasses, designTokens } from '@/lib/design-tokens';

// Buttons
<button className={standardClasses.buttonPrimary}>

// Cards
<div className={standardClasses.card}>

// Forms
<input className={standardClasses.input}>
```

### Available Tokens

- `standardClasses.card` - Standard card styling
- `standardClasses.buttonPrimary` - Primary button
- `standardClasses.buttonSecondary` - Secondary button
- `standardClasses.buttonOutline` - Outline button
- `standardClasses.buttonDanger` - Danger button
- `standardClasses.input` - Input field
- `standardClasses.select` - Select dropdown
- `standardClasses.textarea` - Textarea
- `standardClasses.alertSuccess` - Success alert
- `standardClasses.alertError` - Error alert
- `standardClasses.alertWarning` - Warning alert
- `standardClasses.alertInfo` - Info alert

---

## Accessibility

All components meet WCAG 2.1 accessibility guidelines:

- **Buttons**: Minimum 44px touch target
- **Focus states**: Visible focus rings
- **Color contrast**: AA compliant
- **Keyboard navigation**: Full support
