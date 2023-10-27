---
layout: post
title: "Angular animation"
tags: ["Angular"]
toc: true
notfull: 1
icon: angular.svg
keywords: "animation hide show trigger duration with parameters fade :enter :leave"
---

Notes in this post are just blocks of examples. They're not a full guide to use animation in Angular. For a full guide, read [the official documentation](https://angular.io/guide/animations).

## `:enter` and `:leave`

:point_down: [Official doc](https://angular.io/guide/transition-and-triggers#enter-and-leave-aliases).

```tsx
transition ( ':enter', [ ... ] );  // alias for void => *
transition ( ':leave', [ ... ] );  // alias for * => void
```



## With parameters

```tsx
{%raw%}// Without state
animations: [
  trigger('grow', [
    transition('* <=> *', [
      style({height: '{{startHeight}}px', opacity: 0}),
      animate('.5s ease'),
    ], {params: {startHeight: 0}})
  ])
]
{%endraw%}
```

```tsx
{%raw%}// With state
animations: [
  trigger('dropdownAnimation', [
    state('true', style({
      maxHeight: '{{numberOfDropdownItems}}px',
      overflow: 'hidden'
    }),  {params: {numberOfDropdownItems: 1}}),
    state('false',   style({
      maxHeight: '0px',
      overflow: 'hidden',
      opacity:0
    })),
    transition('true => false', animate('600ms ease-out')),
    transition('false => true', animate('1000ms ease-in'))
  ])
]
{%endraw%}
```



## Make a reusable component

```tsx
// fade-in-out.animation.ts
import { trigger, style, animate, transition } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))]),
  transition(':leave', [animate('200ms', style({ opacity: 0 }))])
]);
```

```html
<!-- users.component.html -->
<div @fadeInOut>Content</div>
```

```jsx
// users.component.ts
import { fadeInOut } from './fade-in-out.animation';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [fadeInOut]
})
export class UsersComponent implements OnInit {
	// Some logics
}
```



## Trigger with states

```html
<!-- data.component.html -->
<div [@dataListTabs]="dataListTabsState">
  Content
</div>
```

```tsx
// data.component.ts
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  animation: [
    trigger('dataListTabs', [
      state('expanded', style({ opacity: '1' })),
      state('collapsed', style({ opacity: '0' })),
      transition('collapsed => expanded', animate('0.4s ease-out')),
      transition('expanded => collapsed', animate('0.01s ease-out'))
    ]),
  ]
})
export class DataComponent implements OnInit {
  dataListTabsState: 'expanded' | 'collapsed';
  // Some logics for dataListTabsState
}
```

