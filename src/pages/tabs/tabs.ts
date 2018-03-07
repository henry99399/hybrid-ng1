import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CityPage } from '../city/city';
import { FindPage } from '../find/find';
import { CenterPage } from '../center/center';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CityPage;
  tab3Root = FindPage;
  tab4Root = CenterPage;

  constructor() {

  }
}
