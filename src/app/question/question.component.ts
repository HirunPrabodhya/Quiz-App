import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../Service/question.service';
import {  interval } from 'rxjs';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit{
  name :string | null = '';
  questionList: any = [];
  currentQuestion: number = 0;
  points: number = 0;
  counter: number = 60;
  correctAnswer:number = 0;
  incorrectAnswer:number = 0;
   interval: any;
   progress: string = '0';
   isQuizCompleted: boolean = false;
  constructor(private questionService: QuestionService) {
   
    
  }
  ngOnInit(): void {
   this.name = localStorage.getItem('name');
   this.getAllQuestions();
   this.startCounter();

  }
    getAllQuestions(): void{
        this.questionService.getQuestionJson()
                              .subscribe(res=> {
                                this.questionList = res.questions
                               
                                    
                            }
                              );
    }
    goToNextQuiz(): void{
        this.currentQuestion++
        this.stopCounter();
    }
    goToPreviousQuiz(): void{
      
        this.currentQuestion--;
    }
    getAnswer(currentQuestion : number, option:any): void{
        if(currentQuestion === this.questionList.length){
            this.isQuizCompleted = true;

        }
        if(option.correct){
            this.points += 10;
            this.correctAnswer++;
            setTimeout(()=>{
                this.currentQuestion++;
                this.resetCounter();
                this.ProgressPercent;
            },1000);
            
        }
        else{
            setTimeout(()=>{
                this.currentQuestion++;
                this.incorrectAnswer++;
                this.resetCounter();
                this.ProgressPercent;
            },1000);
            this.points -= 10;
            
        }
    }
    startCounter(): void{
        this.interval = interval(1000).subscribe(
          val=> {
            this.counter--
            if(this.counter === 0){
                this.currentQuestion++;
                this.counter = 60;
                this.points -= 10;
            }
          }
        )
        setTimeout(()=>{
            this.interval.unsubscribe()
        }, 600000)

    }
    stopCounter(): void{
        this.interval.unsubscribe();
        this.counter = 0;
    }
    resetCounter(): void{
        this.stopCounter();
        this.counter = 60;
        this.startCounter();
    }
    resetQuiz(){
      this.resetCounter();
      this.getAllQuestions();
      this.points= 0;
      this.counter = 60;
      this.currentQuestion = 0;
      this.progress = '0';
     
    }
    get ProgressPercent(){
        this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
        return this.progress;
    }
}
