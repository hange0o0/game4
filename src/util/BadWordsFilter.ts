
class BadWordsFilter {
    
    private static instance: BadWordsFilter = new BadWordsFilter();

    public static validateWords(str): boolean {
        return this.instance.validate(str, this.instance.getWordExp());
    }
    public static replaceWords(str): string {
        return this.instance.replace(str, this.instance.getWordExp());
    }
    
    public static validateName(str): boolean {
        return this.instance.validate(str, this.instance.getNameExp());
    }    
    public static replaceName(str): string {
        return this.instance.replace(str, this.instance.getNameExp());
    }    
    
    
    private wordExp: RegExp;
    private nameExp: RegExp;
    
    public constructor() {
    }
    
    //初始化文字过滤的正则表达式
    public getWordExp() {
        try {
            if(!this.wordExp) this.wordExp = new RegExp(BadWords.BAD_WORDS, 'gi');
        } catch(error) {
            console.log(error.message);
        }
        return this.wordExp;
	}
    public getNameExp() {
        try {
            if(!this.nameExp) this.nameExp = new RegExp(BadWords.BAN_NAMES, 'gi');
        } catch(error) {
            console.log(error.message);
        }
        return this.nameExp;
    }
	
    public validate(str, regExp?: RegExp): boolean {
        if(regExp == null) return false;
        
        regExp.lastIndex = 0; //!!!
        return regExp.test(str);
    }

    public replace(str, regExp?: RegExp): string {
        if(regExp == null) return str; 

        return str.replace(regExp, function(match) {
            var stars = '';
            var len = match.length;
            for(var i = 0;i < len;++i) {
                stars += '*';
            }
            return stars;
        });
    }
    
    
}