// types/gsap.d.ts
declare module 'gsap' {
    export interface GSAPStaggerVars {
      each?: number
      from?: string | number | 'random'
      grid?: number[]
      axis?: string
      ease?: string | Function
      [key: string]: any
    }
  
    export interface GSAPTweenVars {
      [key: string]: any
      duration?: number
      ease?: string | Function
      delay?: number
      stagger?: number | GSAPStaggerVars
    }
  
    export class GSAPTimeline {
      to(
        targets: string | object | Element | Element[],
        vars: GSAPTweenVars,
        position?: string | number
      ): this
    }
  
    export function gsap(): void
    export function timeline(vars?: GSAPTweenVars): GSAPTimeline
    export function to(
      targets: string | object | Element | Element[],
      vars: GSAPTweenVars
    ): void
    export function set(
      targets: string | object | Element | Element[],
      vars: GSAPTweenVars
    ): void
  }