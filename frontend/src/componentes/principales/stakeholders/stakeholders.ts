import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeholdersService } from '../../../services/stakeholders.service';
import { Stakeholder } from '../../../models/stakeholder.interface';

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stakeholders.html',
  styleUrl: './stakeholders.css',
})
export class Stakeholders implements OnInit {

  stakeholders: Stakeholder[] = [];

  constructor(private stakeholdersService: StakeholdersService) {}

  ngOnInit(): void {
    this.loadStakeholders();
  }

  loadStakeholders(): void {
    this.stakeholdersService.getStakeholders().subscribe({
      next: (data) => {
        this.stakeholders = data;
      },
      error: (err) => {
        console.error('Error cargando stakeholders', err);
      }
    });
  }
}
