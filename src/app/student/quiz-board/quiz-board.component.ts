import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Question, Option } from 'src/app/models/interface/Question.interface';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-quiz-board',
  templateUrl: './quiz-board.component.html',
  styleUrls: ['./quiz-board.component.css'],
})
export class QuizBoardComponent implements OnInit {
  quizId: number | undefined;
  questions: Question[] = [];
  lastUpdate = 0;
  selectedOption: Option | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly questionService: QuestionService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.params['token'];
    try {
      const decoded = jwt_decode<{ quiz: number }>(token);
      if (decoded && decoded.quiz) {
        this.quizId = decoded.quiz;
        this.loadQuestions();
      } else {
        this.toastr.error('Invalid token');
        this.router.navigate(['/student/quizzes']);
      }
      console.log(decoded);
    } catch (error) {
      console.log(error);
      this.toastr.error('Invalid token');
      this.router.navigate(['/student/quizzes']);
    }

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.loadQuestions();
      }, 30000);
    }
  }

  loadQuestions() {
    this.questionService
      .findAll(1, this.quizId as number, '', false, this.lastUpdate)
      .subscribe((response) => {
        if (response.success) {
          this.questions.push(...(response.results as []));
          this.lastUpdate = Date.now();
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  onTimerStopped(stopped: boolean) {
    if (stopped) {
      this.submit(this.questions[0]);
    }
  }

  submit(question: Question) {}
}
