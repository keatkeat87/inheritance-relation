
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 's-highlight-text',
  templateUrl: './highlight-text.component.html',
  styleUrls: ['./highlight-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightTextComponent implements OnInit {

  constructor() { }

  @Input()
  set text(value: string) {
    this._text = value;
    this.updateInnerHtml();
  }
  private _text = '';

  @Input()
  set matchText(value: string) {
    this._matchText = value;
    this.updateInnerHtml();
  }
  private _matchText = '';


  private updateInnerHtml() {
    const { _matchText, _text } = this;
    const ipos = this._text.lowerCaseIndexOf(_matchText);
    if (ipos == -1) {
      this.innerHtml = _text;
    }
    else {
      this.innerHtml = `${_text.substring(0, ipos)}<b>${_text.substring(ipos, ipos + _matchText.length)}</b>${_text.substring(ipos + _matchText.length)}`;
    }
  }

  innerHtml = '';
  ngOnInit() {


  }

}

