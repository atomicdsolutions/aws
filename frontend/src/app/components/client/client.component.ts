import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { ApiGatewayService } from 'src/app/service/api-gateway.service';
import { ClientService } from 'src/app/service/client.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  client: Client = {
    name: '',
    apikey: '',
    usagePlanId: '',
    currentUsage: 0,
    remainingUsage: 0
  }
  usageData: any;
  usage: any[] = [];
  remain: any[] = [];
  clients: any[] = [];
  dataSource = new MatTableDataSource<Client>(this.clients);
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;


  // Variables to control visibility
  showInput: boolean = true;  // Show manual input by default
  showCSV: boolean = false;   // Hide CSV upload by default

  // This will hold the uploaded CSV file
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private ags: ApiGatewayService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getClients();
    this.dataSource.paginator = this.paginator;
  }
  // Handle the file input change event
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
    } else {
      console.error('No files selected');
    }
  }

  // Parse the CSV and add clients
  addClientsFromCSV() {
    if (!this.fileToUpload) {
      console.error('No file selected');
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(this.fileToUpload, "UTF-8");
    fileReader.onload = () => {
      const csvData = fileReader.result;
      const allTextLines = (csvData as string).split(/\r\n|\n/);
      const headers = allTextLines[0].split(',');
      const lines = [];

      for (let i = 1; i < allTextLines.length; i++) {
        const data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          const client = {
            name: data[0],
            apikey: data[1],
            usagePlanId: data[2],
            currentUsage: 0,
            remainingUsage: 0
          };
          this.addClientFromCSV(client);
        }
      }
    }
    fileReader.onerror = (error) => {
      console.error('Error reading the CSV file', error);
    }
  }

  // Add a client from the parsed CSV data
  addClientFromCSV(client: Client) {
    this.clientService.addClient(client).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getClients() {
    this.clientService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
      this.dataSource.data = clients;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addClient() {
    const data = {
      name: this.client.name,
      apikey: this.client.apikey,
      usagePlanId: this.client.usagePlanId
    }

    console.log(this.client);
    this.clientService.addClient(data).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error('Error:', error);
      }
    );


  }

  updateClient(index: number) {
    let current = this.clients[index];
    current = {
      name: this.client.name,
      apiKeys: this.client.apikey,
      usagePlans: this.client.usagePlanId
    };
    this.clientService.updateClient(index, current).subscribe((res) => {
      console.log(res);
    }
    );
  }

  deleteClient(index: number) {
    this.clients.splice(index, 1);
  }

  getUsageById(client: Client) {
    // Call your service or API to get the usage details for the given client ID
    this.ags.getUsage(client).subscribe((usage: any) => {
      if (!Array.isArray(usage.data)) {
        console.error('Expected usage to be an array, but got:', usage);
        return;
      }
      console.log(usage.data);
      this.usageData = usage.data;

      this.usageData.forEach((item: any[]) => {
        this.usage.push(item[0]);
        this.remain.push(item[1]);
      });

      // console.log(this.usage);
      client.currentUsage = this.usage[this.usage.length - 1];
      client.remainingUsage = 500000 - this.remain[this.remain.length - 1];

      this.dialog.open(DashboardComponent, {
        width: '800px',
        height: '600px',
        data: { name: client.name, chartData: this.usageData }
      });
    });
  }
}
