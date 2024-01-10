import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { pangoData } from '@pango.common/data/config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Annotation, GeneList } from '../models/annotation';


import { AnnotationService } from '../services/annotation.service';
import { Gene } from '../../gene/models/gene.model';
import { AnnotationDialogService } from '../services/dialog.service';

@Component({
  selector: 'pango-gene-list',
  templateUrl: './gene-list.component.html',
  styleUrls: ['./gene-list.component.scss']
})
export class GeneListComponent implements OnInit, OnDestroy {
  aspectMap = pangoData.aspectMap;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  annotation: Annotation;
  private _unsubscribeAll: Subject<any>;
  geneList: any;
  constructor(
    public annotationService: AnnotationService,
    private annotationDialogService: AnnotationDialogService) {
    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    this.annotationService.onAnnotationChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((annotation) => {
        if (!annotation) {
          return
        }
        this.geneList = annotation

        // console.log(this.annotation)
      });


    this.annotationService.onGeneListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((geneList) => {
        if (!geneList) {
          return
        }
        this.geneList = geneList

        // console.log(this.annotation)
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  selectedGeneIndex: number | null = null;

  selectGene(geneList: GeneList): void {
    this.annotationService.selectGeneList(geneList)
  }

  editGeneList(geneList: GeneList): void {

    const success = (geneData) => {
      if (geneData) {
        console.log(geneData);
        // self.geneList.push(geneData);
      }
    };
    const data = { genes: geneList.genes, description: geneList.description }

    this.annotationDialogService.openUploadGenesDialog(data, success);
  }

  deleteGeneList(index: number): void {

    this.annotationService.deleteGeneList(index)
  }
  close() {
    this.panelDrawer.close()
  }
}

