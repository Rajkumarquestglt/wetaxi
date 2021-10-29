import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';
// import DashboardComponent from '../../../../demo/dashboard/dashboard.component'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('collapsedCard', [
      state('collapsed, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('expanded',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE,
        })
      ),
      transition('collapsed <=> expanded', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('cardRemove', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('open <=> closed', animate('400ms')),
    ])
  ]
})

export class CardComponent implements OnInit {
  @Input() cardTitle: string;
  @Input() cardClass: string;
  @Input() blockClass: string;
  @Input() headerClass: string;
  @Input() options: boolean;
  @Input() cardButton:boolean;
  @Input() hidHeader: boolean;
  @Input() customHeader: boolean;
  @Input() showWeek: boolean;
  @Input() showMonth: boolean;
  @Input() showPdf: boolean;
  @Input() showExcel: boolean;


  @Output() weekFunction: EventEmitter<any> = new EventEmitter();
  @Output() monthFunction: EventEmitter<any> = new EventEmitter();
  @Output() pdfFunction: EventEmitter<any> = new EventEmitter();
  @Output() excelFunction: EventEmitter<any> = new EventEmitter();
 
  pdfWasClicked(clickedEntry): void {
    // console.log("pdf clickedEntry",clickedEntry)
      this.pdfFunction.emit([clickedEntry, "pdfClick"]);
  } 
  excelWasClicked(clickedEntry): void {
    // console.log("excel clickedEntry",clickedEntry)
      this.excelFunction.emit([clickedEntry, "excelClick"]);
  }

  weekWasClicked(clickedEntry): void {
    // console.log("week clickedEntry",clickedEntry)
      this.weekFunction.emit([clickedEntry, "weekClick"]);
  }

  monthWasClicked(clickedEntry): void {
    // console.log("month clickedEntry",clickedEntry)
      this.monthFunction.emit([clickedEntry, "monthClick"]);
  }

  // @Input() cardId:String;
  public animation: string;
  public fullIcon: string;
  public isAnimating: boolean;
  public animator: AnimationBuilder;
  public animators: AnimationBuilder;

  public collapsedCard: string;
  public collapsedIcon: string;

  public loadCard: boolean;

  public cardRemove: string;

  constructor(animationService: AnimationService, config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
    this.customHeader = false;
    this.options = true;
    this.hidHeader = false;
    this.cardTitle = 'Card Title';
    this.animator = animationService.builder();
    this.animators = animationService.builder();
    this.animator.useVisibility = true;
    this.fullIcon = 'icon-maximize';
    this.isAnimating = false;

    this.collapsedCard = 'expanded';
    this.collapsedIcon = 'icon-minus';

    this.loadCard = false;

    this.cardRemove = 'open';
  }
  
  
  ngOnInit() {
    if (!this.options || this.hidHeader || this.customHeader) {
      this.collapsedCard = 'false';
    }
  }

  public fullCardToggle(element: HTMLElement, animation: string, status: boolean) {
    animation = this.cardClass === 'full-card' ? 'zoomOut' : 'zoomIn';
    this.fullIcon = this.cardClass === 'full-card' ? 'icon-maximize' : 'icon-minimize';
    // const duration = this.cardClass === 'full-card' ? 300 : 600;
    this.cardClass = this.cardClass === 'full-card' ? this.cardClass : 'full-card';
    if (status) {
      this.animation = animation;
    }
    this.isAnimating = true;

    this.animators
      .setType(this.animation)
      .setDuration(500)
      .setDirection('alternate')
      .setTimingFunction('cubic-bezier(0.1, -0.6, 0.2, 0)')
      .animate(element)
      .then(() => {
        this.isAnimating = false;
      })
      .catch(e => {
        this.isAnimating = false;
      });
    setTimeout(() => {
      this.cardClass = animation === 'zoomOut' ? '' : this.cardClass;
      if (this.cardClass === 'full-card') {
        document.querySelector('body').style.overflow = 'hidden';
      } else {
        document.querySelector('body').removeAttribute('style');
      }
    }, 500);
  }

  collapsedCardToggle(event) {
    this.collapsedCard = this.collapsedCard === 'collapsed' ? 'expanded' : 'collapsed';
    this.collapsedIcon = this.collapsedCard === 'collapsed' ? 'icon-plus' : 'icon-minus';
  }

  cardRefresh() {
    this.loadCard = true;
    this.cardClass = 'card-load';
    setTimeout( () => {
      this.loadCard = false;
      this.cardClass = 'expanded';
    }, 3000);
  }

  cardRemoveAction(event) {
    this.cardRemove = this.cardRemove === 'closed' ? 'open' : 'closed';
  }

}
