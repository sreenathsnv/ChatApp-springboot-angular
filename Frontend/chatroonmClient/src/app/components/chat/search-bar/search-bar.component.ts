import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SearchFilter } from '../../../models/search-filter';
import { CookieService } from 'ngx-cookie-service';
import { RoomService } from '../../../service/room.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<SearchFilter[]>();


  
  // Search properties
  searchQuery: string = '';
  isFocused: boolean = false;
  isSearching: boolean = false;
  showSuggestions: boolean = false;
  showFilters: boolean = false;
  isDarkMode: boolean = false;

  // Search data
  searchSuggestions: string[] = [];
  recentSearches: string[];
;

  // Search filters
  searchFilters: SearchFilter[] = [
    { id: 'messages', label: 'Messages', active: true },
    { id: 'users', label: 'Users', active: false },
    { id: 'files', label: 'Files', active: false },
    { id: 'images', label: 'Images', active: false }
  ];

  // Search debouncing
  private searchSubject = new Subject<string>();

  constructor(
    private cookieService:CookieService,
    private roomService:RoomService
  ){
   roomService.getUserRooms().subscribe({
    next:(resp)=> this.cookieService.set('suggestions', JSON.stringify(resp.map(room => room.roomName)))
   }
    )
    this.recentSearches = this.cookieService.get('searches')?.split(',') || [];
  }

  
  ngOnInit(): void {
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });

    // Check for dark mode (you can implement your own dark mode detection)
    this.checkDarkMode();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // Search input handler
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.showSuggestions = true;
    
    if (this.searchQuery.length > 0) {
      this.isSearching = true;
      this.searchSubject.next(this.searchQuery);
    } else {
      this.isSearching = false;
      this.searchSuggestions = [];
    }
    
    this.searchChange.emit(this.searchQuery);
  }

  // Focus handlers
  onSearchFocus(): void {
    this.isFocused = true;
    this.showSuggestions = true;
  }

  onSearchBlur(): void {
    this.isFocused = false;
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  // Search submit
  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.addToRecentSearches(this.searchQuery.trim());
      this.searchSubmit.emit(this.searchQuery.trim());
      this.showSuggestions = false;
    }
  }

  // Clear search
  clearSearch(): void {
    this.searchQuery = '';
    this.searchSuggestions = [];
    this.showSuggestions = false;
    this.isSearching = false;
    this.searchChange.emit('');
  }

  // Select search suggestion
  selectSearch(query: string): void {
    this.searchQuery = query;
    this.addToRecentSearches(query);
    this.searchSubmit.emit(query);
    this.showSuggestions = false;
  }

  // Toggle search filter
  toggleFilter(filter: SearchFilter): void {
    filter.active = !filter.active;
    this.filterChange.emit(this.searchFilters);
  }

  // Toggle filters visibility
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Track by functions for ngFor
  trackByIndex(index: number): number {
    return index;
  }

  trackByFilter(index: number, filter: SearchFilter): string {
    return filter.id;
  }

  // Private methods
  private performSearch(query: string): void {
    // Simulate API call or actual search logic
    setTimeout(() => {
      this.isSearching = false;
      
      if (query.length > 0) {
        // Mock search suggestions - replace with actual search API
        this.searchSuggestions = this.cookieService.get('suggestions')?.split(',') || [] ;
      } else {
        this.searchSuggestions = [];
      }
    }, 300);
  }

  private addToRecentSearches(query: string): void {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(search => search !== query);
    
    // Add to beginning
    this.recentSearches.unshift(query);

    // Keep only last 5 searches
    this.recentSearches = this.recentSearches.slice(0, 5);
    this.cookieService.set('searches',JSON.stringify(this.recentSearches))
   
  }

  private checkDarkMode(): void {
    // Implement your dark mode detection logic
    // This could be from a service, localStorage, or system preference
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }
}
