import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  readonly currentUser = this.authService.currentUser;
  isLoggingOut = signal(false);

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Logout the current admin user.
   */
  logout(): void {
    this.isLoggingOut.set(true);
    this.authService.logout().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        this.isLoggingOut.set(false);
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
