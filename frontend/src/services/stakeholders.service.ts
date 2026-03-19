import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stakeholder } from '../models/stakeholder.interface';

@Injectable({
  providedIn: 'root'
})
export class StakeholdersService {

  private apiUrl = 'http://localhost:3000/stakeholders';

  constructor(private http: HttpClient) {}

  getStakeholders(): Observable<Stakeholder[]> {
    return this.http.get<Stakeholder[]>(this.apiUrl);
  }

  getStakeholdersByProyecto(idproyecto: number): Observable<Stakeholder[]> {
    return this.http.get<Stakeholder[]>(`${this.apiUrl}/proyecto/${idproyecto}`);
  }

  createStakeholder(stakeholder: Stakeholder): Observable<Stakeholder> {
    return this.http.post<Stakeholder>(this.apiUrl, stakeholder);
  }

  deleteStakeholder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}