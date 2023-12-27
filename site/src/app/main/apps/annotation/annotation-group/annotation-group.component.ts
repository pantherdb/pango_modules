import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PangoMenuService } from '@pango.common/services/pango-menu.service';
import { AnnotationService } from './../services/annotation.service'
import { AnnotationPage } from '../models/page';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { RightPanel } from '@pango.common/models/menu-panels';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { environment } from 'environments/environment';
import { pangoData } from '@pango.common/data/config';
import { Annotation } from '../models/annotation';
import { Gene } from '../../gene/models/gene.model';
@Component({
  selector: 'pango-annotation-group',
  templateUrl: './annotation-group.component.html',
  styleUrls: ['./annotation-group.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationGroupComponent implements OnInit, OnDestroy, OnChanges {
  RightPanel = RightPanel;
  aspectMap = pangoData.aspectMap;
  evidenceTypeMap = pangoData.evidenceTypeMap;

  uniprotUrl = environment.uniprotUrl;
  columns: any[] = [];
  count = 0

  bpModules: any[] = []

  amigoTermUrl = environment.amigoTermUrl
  pubmedUrl = environment.pubmedUrl

  loadingIndicator: boolean;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  taxonApiUrl = environment.taxonApiUrl

  @Input() annotationPage: AnnotationPage;

  @ViewChild(MatTable) table: MatTable<any>

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  dataSource = new MatTableDataSource<any>();

  genes: Gene[];

  displayedColumns = [
    'expand',
    'gene',
    'mfs',
    'bps',
    'ccs',
  ];

  @Input('maxReferences') maxReferences = 2
  @Input('maxEvidences') maxEvidences = 2
  @Input('options') options;

  selectedGP: Gene


  ibdData = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    }
  ]

  categories = []
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  private _unsubscribeAll: Subject<any>;

  constructor(
    public pangoMenuService: PangoMenuService,
    public annotationService: AnnotationService
  ) {

    this.loadingIndicator = false;

    this._unsubscribeAll = new Subject();

    this.annotationService.getJsonData()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.annotationPage.currentValue) {
      this.genes = this.annotationPage.annotations
      this.dataSource = new MatTableDataSource<any>(this.genes);
    }
  }

  ngOnInit(): void {

    this.annotationService.onBPModulesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((bpModules) => {
        if (!bpModules) {
          this.bpModules = []
          return
        }

        this.bpModules = bpModules

        this.categories = this.bpModules.map((bpModule) => {
          return {
            name: bpModule.label,
            value: bpModule.count
          }
        });

        // this.categories = this.transformData(this.bpModules)

        this.annotationService.onCategoryChanged.next(bpModules)

        //console.log(this.categories)
      });


    if (this.options?.displayedColumns) {
      this.displayedColumns = this.options.displayedColumns
    }
  }


  toggleExpand(gene: Gene) {
    gene.expanded = !gene.expanded;

    if (gene.expanded) {
      gene.maxTerms = 500
    } else {
      gene.maxTerms = 2
    }

  }

  getUcscLink(element: Gene) {
    const chr = `${element.coordinatesChrNum}:${element.coordinatesStart}-${element.coordinatesEnd}`
    return environment.ucscUrl + chr
  }

  getUniprotLink(element: Gene) {
    const geneId = element.gene?.split(':')

    if (geneId.length > 1) {
      return this.uniprotUrl + geneId[1];
    }

    return element.gene;
  }

  getFamilyLink(element: Gene) {
    return `${environment.pantherFamilyUrl}book=${encodeURIComponent(element.pantherFamily)}&seq=${encodeURIComponent(element.longId)}`
  }

  setPage($event) {
    if (this.annotationPage) {
      this.annotationService.getGenesPage(this.annotationPage.query, $event.pageIndex + 1);
    }
  }

  selectAnnotation(row) {
    this.pangoMenuService.selectRightPanel(RightPanel.annotationDetail);
    this.pangoMenuService.openRightDrawer();
    this.annotationService.onAnnotationChanged.next(row);
  }

  selectGene(gene: string) {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  openAnnotationSearch() {
    this.pangoMenuService.selectRightPanel(RightPanel.annotationSearch);
    this.pangoMenuService.openRightDrawer()
  }

  openAnnotationTable() {
    this.pangoMenuService.selectRightPanel(RightPanel.annotationTable);
    this.pangoMenuService.closeRightDrawer()
  }

  openAnnotationSummary(term) {
    this.annotationService.onBPModuleChanged.next(term)
    this.pangoMenuService.selectRightPanel(RightPanel.annotationDetail);
    this.pangoMenuService.openRightDrawer()
  }

  openAnnotationStats() {
    this.pangoMenuService.selectRightPanel(RightPanel.annotationStats);
    this.pangoMenuService.openRightDrawer();
  }
}

