import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentedEvent } from '@/domain/forum/enterprise/events/answer-commented-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnAnswerCommented implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      const question = await this.questionsRepository.findById(
        answer?.questionId.toString(),
      )

      if (question) {
        await this.sendNotification.execute({
          recipientId: answer.authorId.toString(),
          title: `Novo comentário na resposta que você fez em "${question.title
            .substring(0, 20)
            .concat('...')}"`,
          content: answerComment.content.substring(0, 40).concat('...'),
        })
      }
    }
  }
}
