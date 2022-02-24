import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { CreateAnswerRequest } from 'src/app/models/interface/Answer.interface';
import { Question, Option } from 'src/app/models/interface/Question.interface';
import { Quiz } from 'src/app/models/interface/Quiz.interface';
import { AnswerService } from 'src/app/services/answer.service';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-board',
  templateUrl: './quiz-board.component.html',
  styleUrls: ['./quiz-board.component.css'],
})
export class QuizBoardComponent implements OnInit {
  quizId: number | undefined;
  quiz: Quiz | undefined;
  questions: Question[] = [];
  lastUpdate = 0;
  selectedOption: Option | undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly questionService: QuestionService,
    private readonly quizService: QuizService,
    private readonly answerService: AnswerService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.params['token'];
    try {
      const decoded = jwt_decode<{ quiz: number }>(token);
      if (decoded && decoded.quiz) {
        this.quizId = decoded.quiz;
        this.quizService.findOne({ id: this.quizId }).subscribe((response) => {
          if (response.success) {
            this.quiz = response.result;
          }
          this.loadQuestions();
        });
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

  onSelectOption(option: Option) {
    console.log(option.option);
    this.selectedOption = option;
  }

  optionLabel(index: number) {
    return String.fromCharCode(97 + index);
  }

  submit(question: Question) {
    const request: CreateAnswerRequest = {
      answer: `${
        this.selectedOption?.option ? this.selectedOption?.option : ''
      }`,
      quizId: question.quizId,
      questionId: question.id,
    };

    this.toastr.info('Submitting...', '', { disableTimeOut: true });

    this.answerService.submitAnswer(request).subscribe((response) => {
      this.toastr.clear();
      if (!response.success) {
        this.toastr.error(response.message);
      }
      // Next Question
      const index = this.questions.findIndex((d) => d.id === question.id);
      if (index !== -1) {
        this.questions.splice(index, 1);
      }
    });
  }
}
