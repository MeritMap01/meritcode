import { Source } from './Source.interface';
 
export interface SearchResult extends Source{
    _index: string,
    _id: string,
    _score: number,
}