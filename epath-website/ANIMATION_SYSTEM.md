# EPath Animation System

Hệ thống animation tập trung cho toàn bộ ứng dụng EPath.

## Cấu trúc

```
lib/animations/
├── config.ts      # Cấu hình thời gian, easing, delays
├── variants.ts    # Animation variants có thể tái sử dụng
├── hooks.ts       # Custom hooks cho animation
└── index.ts       # Export tất cả




components/ui/
├── animate-on-scroll.tsx   # Scroll-triggered animations
├── animated-counter.tsx    # Counter animations
├── animate-hover.tsx      # Hover/tap animations
├── animated-text.tsx       # Text animations
└── index.ts               # Export tất cả
```

## Sử dụng cơ bản

### 1. Import Animation System

```typescript
import { fadeInUp, bounce, staggerFadeInUp, ANIMATION_DURATION } from '@/lib/animations'
```

### 2. Animation Variants có sẵn

```typescript
// Entrance animations
fadeInUp      // Fade in từ dưới lên
fadeInDown    // Fade in từ trên xuống
fadeInLeft    // Fade in từ trái
fadeInRight   // Fade in từ phải
fadeIn        // Fade in đơn giản
scaleIn       // Scale in
scaleInBounce // Scale in với bounce

// Stagger animations
staggerFadeInUp()    // Container cho staggered list
staggerFadeIn()      // Fade stagger đơn giản
staggerScaleIn()     // Scale stagger

// Hover animations
hoverScaleUp   // Scale up khi hover
hoverLift      // Lift effect khi hover

// Loop animations
float          // Float lên xuống
bounce         // Bounce animation
pulse          // Pulse animation
wiggle         // Wiggle animation

// Page transitions
pageTransition
pageTransitionScale
```

### 3. Animation Configuration

```typescript
import { ANIMATION_DURATION, STAGGER_DELAY, ANIMATION_EASE } from '@/lib/animations'

// Duration presets (seconds)
ANIMATION_DURATION.instant  // 0.1
ANIMATION_DURATION.fast     // 0.15
ANIMATION_DURATION.normal   // 0.25
ANIMATION_DURATION.slow     // 0.35
ANIMATION_DURATION.slower   // 0.5

// Stagger delays (seconds)
STAGGER_DELAY.fastest  // 0.03
STAGGER_DELAY.fast     // 0.05
STAGGER_DELAY.normal   // 0.08
STAGGER_DELAY.slow     // 0.12

// Easing
ANIMATION_EASE.easeOut
ANIMATION_EASE.spring
ANIMATION_EASE.springBounce
```

## Ví dụ sử dụng

### 1. Fade In On Scroll

```tsx
import { AnimateOnScroll } from '@/components/ui'

// Đơn giản
<AnimateOnScroll>
  <Card>Content</Card>
</AnimateOnScroll>

// Với tùy chọn
<AnimateOnScroll direction="left" delay={0.2} preset="scale">
  <Card>Content</Card>
</AnimateOnScroll>
```

### 2. Stagger Container

```tsx
import { StaggerContainer, StaggerItem } from '@/components/ui'

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

### 3. Animated Counter

```tsx
import { AnimatedCounter } from '@/components/ui'

<AnimatedCounter 
  value={100}
  suffix="+"
  prefix=""
/>
```

### 4. Hover Effects

```tsx
import { AnimateHover } from '@/components/ui'

<AnimateHover preset="lift">
  <Button>Hover me</Button>
</AnimateHover>

// Hoặc magnetic button
import { MagneticButton } from '@/components/ui'

<MagneticButton href="/about">
  Magnetic Button
</MagneticButton>
```

### 5. Text Animations

```tsx
import { AnimatedText, SplitText, TypewriterText } from '@/components/ui'

// Fade word by word
<AnimatedText type="fade">Hello World</AnimatedText>

// Slide word by word
<SplitText text="Welcome to EPath" animation="slide" />

// Typewriter effect
<TypewriterText text="Loading..." speed={50} />
```

### 6. Sử dụng với Framer Motion trực tiếp

```tsx
import { motion } from 'framer-motion'
import { fadeInUp, bounce } from '@/lib/animations'

// Đơn giản
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  Content
</motion.div>

// Với variants
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: ANIMATION_DURATION.slow }
    }
  }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: STAGGER_DELAY.normal }
    }
  }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Custom Hooks

```tsx
import { useScrollReveal, useStaggerContainer, useCounter } from '@/lib/animations'

// Scroll reveal hook
const { ref, isInView } = useScrollReveal({ once: true, margin: '-50px' })

// Stagger container hook
const { ref, isInView, childVariants } = useStaggerContainer(itemCount, 0.08)

// Counter hook
const count = useCounter(100, isActive, { duration: 1500, steps: 50 })
```

## Page Transitions

```tsx
// Trong layout
import { PageTransition } from '@/components/page-transition'

export default function LocaleLayout({ children }) {
  return (
    <>
      <Header />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer />
    </>
  )
}
```

## Best Practices

1. **Sử dụng preset animations** thay vì tạo mới để đảm bảo tính nhất quán
2. **Tránh animation quá phức tạp** - giữ animation nhanh và mượt
3. **Sử dụng `once: true`** cho scroll animations để tránh re-trigger
4. **Cẩn thận với duration** - quá nhanh sẽ gây khó chịu, quá chậm sẽ làm chậm UI
5. **Animation phải có mục đích** - không animate những thứ không cần thiết
