import {Pipe, PipeTransform} from "@angular/core";
import {Post} from "../../shared/interfaces";

@Pipe({
    name: 'searchPosts'
})
export class SearchPostsPipe implements PipeTransform {
    transform(posts: Post[], searchStr: string): Post[] {
        if (!searchStr.trim()) {
            return posts
        }
        return posts.filter(post => post.title.toLowerCase().includes(searchStr.toLowerCase()))
    }
}
