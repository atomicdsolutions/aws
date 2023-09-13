import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Chart, LinearScale, BarController, LineController, CategoryScale, registerables } from 'chart.js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiGatewayService } from 'src/app/service/api-gateway.service';
Chart.register(...registerables);

Chart.register(LinearScale, BarController, LineController, CategoryScale);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('barChartCanvas') barChartCanvas?: ElementRef;
  @ViewChild('lineChartCanvas') lineChartCanvas?: ElementRef;

  lineChart: any;
  barChart: any;
  myChart: any;
  client: any;

  barChartData: any[] = [];
  lineChartData: any[] = [];
  labels: any;
  data: any;

  lastUsed: number | null = null;
  lastRemaining: number = 0;

  constructor(
    private aws: ApiGatewayService,
    @Inject(MAT_DIALOG_DATA) public usageData: any
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // const data = {
    //   apikey: "c8vhmtdfo4",
    //   usagePlanId: "wf7f2k"
    // }
    // this.aws.getUsage(data).subscribe((res: any) => {
    this.data = this.usageData.chartData;
    // console.log(this.data);
    this.labels = this.data.map((_: any, index: number) => `Day ${index + 1}`);
    this.client = this.usageData.name;
    console.log(this.client);
    this.data.forEach((item: any[]) => {
      this.barChartData.push(item[0]);
      this.lineChartData.push(item[1]);
    });


    this.lastRemaining = this.lineChartData[this.lineChartData.length - 1];
    this.lastUsed = 500000 - this.lastRemaining;
    this.initializeBarChart(this.barChartData);
    this.initializeLineChart(this.lineChartData);

    // });
  }

  initializeBarChart(barChartData: any) {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Bar Data',
          data: this.barChartData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      }
    });
  }

  initializeLineChart(lineChartData: any) {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Line Data',
          data: this.lineChartData,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      }
    });
  }

  initializeNumberChart(elementId: string, label: string, value: number) {
    const canvasElement = document.getElementById(elementId) as HTMLCanvasElement;
    if (!canvasElement) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      console.error(`Unable to get 2D context for element with id ${elementId}`);
      return;
    }
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [label],
        datasets: [{
          data: [value],
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}
