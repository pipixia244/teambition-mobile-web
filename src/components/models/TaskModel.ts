/// <reference path="../interface/teambition.d.ts" />
module teambition {
  'use strict';

  export interface ITaskModel extends IDetailModel {
    setNoneExecutorCollection(projectId: string, content: ITaskData[]): ITaskDataParsed[];
    getNoneExecutorCollection(projectId: string): ITaskDataParsed[];
    setDueCollection(projectId: string, content: ITaskData[]): ITaskDataParsed[];
    getDueExecutorCollection(projectId: string): ITaskDataParsed[];
    setTasklistCollection(tasklistId: string, collection: ITaskData[]): ITaskDataParsed[];
    getTasklistCollection(tasklistId: string): ITaskDataParsed[];

  }

  class TaskModel extends DetailModel implements ITaskModel {

    private noneExecutorCollectionIndex: string[] = [];
    private dueCollectionIndex: string[] = [];
    private tasklistCollectionIndex: string[] = [];

    public setNoneExecutorCollection(projectId: string, content: ITaskDataParsed[]) {
      let cache = this._get<ITaskDataParsed[]>('noneExecutor:tasks', projectId);
      let results = [];
      if (!cache) {
        angular.forEach(content, (task: ITaskDataParsed, index: number) => {
          let taskCache = this._get('task:detail', task._id);
          if (!taskCache) {
            let result = this.taskParser(task);
            results.push(result);
            this._set('task:detail', result._id, result);
          }else {
            results.push(taskCache);
          }
          this.noneExecutorCollectionIndex.push(task._id);
        });
        this._set('noneExecutor:tasks', projectId, results);
        return results;
      }
      return cache;
    }

    public getNoneExecutorCollection(projectId: string) {
      let cache = this._get<ITaskDataParsed[]>('noneExecutor:tasks', projectId);
      return cache;
    }

    public setDueCollection(projectId: string, content: ITaskDataParsed[]) {
      let cache = this._get<ITaskDataParsed[]>('due:tasks', projectId);
      let results = [];
      if (!cache) {
        angular.forEach(content, (task: ITaskDataParsed, index: number) => {
          let taskCache = this._get('task:detail', task._id);
          if (!taskCache) {
            let result = this.taskParser(task);
            this._set('task:detail', result._id, result);
            results.push(result);
          }else {
            results.push(taskCache);
          }
          this.dueCollectionIndex.push(task._id);
        });
        this._set('due:tasks', projectId, results);
        return results;
      }
      return cache;
    }

    public getDueExecutorCollection(projectId: string) {
      let cache = this._get<ITaskDataParsed[]>('due:tasks', projectId);
      return cache;
    }

    public setTasklistCollection(tasklistId: string, collection: ITaskData[]) {
      let cache = this.getTasklistCollection(tasklistId);
      if (!cache) {
        let results: ITaskDataParsed[] = [];
        if (collection.length) {
          angular.forEach(collection, (task: ITaskData, index: number) => {
            let cache = this._get<ITaskDataParsed>('task:detail', task._id);
            if (!cache) {
              let result: ITaskDataParsed = this.taskParser(task);
              this.setDetail(`task:detail:${task._id}`, task);
              this.tasklistCollectionIndex.push(task._id);
              results.push(result);
            }else {
              results.push(cache);
            }
          });
        }
        this._set('tasks:in', tasklistId, results);
        return results;
      }else {
        angular.forEach(collection, (task: ITaskDataParsed, index: number) => {
          if (this.tasklistCollectionIndex.indexOf(task._id) === -1) {
            let taskCache = this._get<ITaskDataParsed>('task:detail', task._id);
            if (!taskCache) {
              let result = this.taskParser(task);
              cache.push(result);
              this._set('task:detail', result._id, result);
              this.tasklistCollectionIndex.push(task._id);
            }else {
              cache.push(taskCache);
            }
          }
        });
        return cache;
      }
    }

    public getTasklistCollection(tasklistId: string) {
      return this._get<ITaskDataParsed[]>('tasks:in', tasklistId);
    }
  }

  angular.module('teambition').service('TaskModel', TaskModel);
}
