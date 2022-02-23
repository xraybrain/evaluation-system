import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { QuizResult } from 'src/app/models/interface/Quiz.interface';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
})
export class QuizResultsComponent implements OnInit {
  @Input()
  quizId: number | undefined;
  quizResults: QuizResult[] = [];
  constructor(
    private readonly quizService: QuizService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.quizService
      .findQuizResults(this.quizId as number)
      .subscribe((response) => {
        if (response.success) {
          if (response.results) this.quizResults = response.results;
        } else {
          this.toastr.error(response.message, '');
        }
      });
  }
}
