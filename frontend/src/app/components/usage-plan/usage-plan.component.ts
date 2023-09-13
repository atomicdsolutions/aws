import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from 'src/app/service/api-gateway.service';

@Component({
  selector: 'app-usage-plan',
  templateUrl: './usage-plan.component.html',
  styleUrls: ['./usage-plan.component.scss']
})
export class UsagePlanComponent implements OnInit {

  usagePlan: any = {
        id: '',
        name: '',
        description: 'Free plan',
        limit: '500000'
  }
  constructor(private apiGatewayService: ApiGatewayService) { }

  ngOnInit(): void {
    const data = {
      apikey: 'c8vhmtdfo4',
      position: '1'
    }
    this.apiGatewayService.getUsagePlan(data).subscribe((data: any) => {
      console.log(data.items);
      this.usagePlan = data.items;
    });
  }
}
