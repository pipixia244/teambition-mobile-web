/// <reference path="../../../../interface/teambition.d.ts" />
module teambition {
  'use strict';
  @inject([
    'SubtasksAPI'
  ])
  class SubtaskView extends View {

    public ViewName = 'SubtaskView';
    public subtasks: ISubtaskData[];

    public nobodyUrl = nobodyUrl;

    private SubtasksAPI: ISubtasksAPI;
    private taskid: string;

    constructor() {
      super();
      this.zone.run(() => {
        this.taskid = this.$state.params._id;
      });
    }

    public onInit() {
      return this.SubtasksAPI.fetch(this.taskid)
      .then((data: ISubtaskData[]) => {
        this.subtasks = data;
      });
    }

    public onAllChangesDone() {
      if (Ding) {
        Ding.setRight('增加子任务', true, false, () => {
          window.location.hash = `/detail/task/${this.taskid}/subtasks/create`;
        });
      }
    }

    public doSubTask(subtask: ISubtaskData) {
      return this.SubtasksAPI.update(subtask._id, {
        isDone: !subtask.isDone
      }, 'isDone')
      .catch((reason: any) => {
        let message = this.getFailureReason(reason);
        this.showMsg('error', '更新状态出错', message);
      });
    }
  }

  angular.module('teambition').controller('SubtaskView', SubtaskView);
}
