%
%   rocks_variability_progress.m
%

clear all;
Screen('Preference','SkipSyncTests',1);
image_location=[pwd '\rocksall480\'];
data_location=[pwd '\data\'];
condition = input(' condition # [1 or 2] ');
subid=input(' subject # ');
%feedcorroffset=input('feedcorroffset ');
feedxnameoffset=50;
%yoffset=input('yoffset [20]');
%xshift=input('xshift ');
%feedynameoffset=input('feedynameoffset ');
yoffset=20;
xshift=0;
filename=[data_location 'rockvar' num2str(condition) 's' num2str(subid) '.txt'];
allvars=[data_location 'rockvar'  num2str(condition) 's' num2str(subid)];

if ~exist(filename)
    fid=fopen(filename,'wt');
    s=RandStream('mt19937ar','Seed','shuffle');
    RandStream.setGlobalStream(s);
    HideCursor;
    KbName('UnifyKeyNames');
    
    images=dir([image_location '*.png']);
    for i=1:480
        pictures{i}=images(i).name;
    end
    
    %
    if condition == 1
        % original_train = [52 16 56 35 33 6 4 37 15 36 38 49 53 58 48 57 59 14 1 60  271 250 216 267 269 212 217 219 272 266 245 252 253 258 209 218 251 224 222 221   471 408 353 356 409 465 411 473 479 476 406 359 360 361 405 403 412 416 366 466];
        train=[80 52 16 56 71 35 33 6 4 37 15 121 36 117 38 49 53 120 66 58   271 164 250 216 182 267 269 212 217 219 272 266 245 252 289 240 290 201 280 276    471 408 353 387 356 409 380 465 424 411 326 448 396 340 473 479 476 406 359 360];            
    elseif condition == 2
        train=[7 16 17 31 40 34 62 55 72 73 96 85 111 106 115 125 136 135 148 146    163 170 186 190 195 203 224 215 229 238 250 241 272 267 279 278 293 297 308 306   327 330 337 339 355 359 381 376 397 395 405 413 423 420 446 443 455 456 471 465];
    end
    
    phase=1;
    oldnew=1;
    nblock = 3;
    ntest = 300;
    %nblock=input(' # pilot training blocks= ');
    %ntest = input('# of pilot trials during test phase ');
    
   
    %
    %  set up Screen and define screen-related constants
    %
    
    %
    %loc=[x1 y1+pictureoffset x2 y2+pictureoffset];
    fixation='*';
    press_space='When Ready, Press Space to Begin the Study Phase ';
    press_space_test='When Ready, Press Space to Begin the Test Phase';
    endblock='End of Test Block ';
    study_end='End of Study Phase';
    thanks='Thank You, the Experiment is Over!';
    pressq='(Press ''q'' to exit)';
    promptcat='Identify the Rock Category';
    prompt='Old or New?';
    text_correct='CORRECT!';
    text_incorrect='INCORRECT';
    text_okay='OKAY';
    percentage='Percent Correct= ';
    too_fast='Please Look Carefully at the Rock Before Responding';
    too_slow='Please Respond in Less than Seven Seconds';
    wait10='10-Second Break Between Study and Test';
    IgMetSed='I = Igneous, M = Metamorphic,  S = Sedimentary';   
    descript{1}='Igneous';
    descript{2}='Metamorphic';
    descript{3}='Sedimentary';
    traintrialA='Training trial   ';
    traintrialB=' of 180';
    testtrialA='Test trial   ';
    testtrialB=' of 300';  
    legalkeys={'i','m','s'};
    
    % present study phase rocks
    %
    imageScale=.25;
    %[wind1 rect] = Screen('OpenWindow',0,[255 255 255],[50 50 1200 700]);
    [wind1 rect] = Screen('OpenWindow',0,[255 255 255]);
    Screen('BlendFunction', wind1, GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    centerx=(rect(3)-rect(1))/2;
    centery=(rect(4)-rect(2))/2;
    topscreen=rect(2)+50;
    bottomscreen=rect(4)-50;
    
    textsize=30;
    Screen('TextSize',wind1,textsize);
    textbounds_thanks=Screen('TextBounds',wind1,thanks);
    textbounds_pressq=Screen('TextBounds',wind1,pressq);
    textbounds_press_space=Screen('TextBounds',wind1,press_space);
    textbounds_press_space_test=Screen('TextBounds',wind1,press_space_test);
    textbounds_endblock=Screen('TextBounds',wind1,endblock);
    textbounds_study_end=Screen('TextBounds',wind1,study_end);
    textbounds_prompt=Screen('TextBounds',wind1,prompt);
    textbounds_promptcat=Screen('TextBounds',wind1,promptcat);
    textbounds_correct=Screen('TextBounds',wind1,text_correct);
    textbounds_incorrect=Screen('TextBounds',wind1,text_incorrect);
    textbounds_okay=Screen('TextBounds',wind1,text_okay);
    textbounds_percentage=Screen('TextBounds',wind1,percentage);
    textbounds_too_fast=Screen('TextBounds',wind1,too_fast);
    textbounds_too_slow=Screen('TextBounds',wind1,too_slow);
    textbounds_wait10=Screen('TextBounds',wind1,wait10);
    textbounds_IgMetSed = Screen('TextBounds',wind1,IgMetSed);

    WaitSecs(1);
    
    %%
    %  start of training phase of experiment
    %
    %   present instructions
    %
    instructions_variability_study(wind1,rect);
    %
    Screen('TextSize',wind1,textsize)
    Screen('DrawText',wind1,press_space,rect(3)/2-textbounds_press_space(3)/2,rect(4)/2-textbounds_press_space(4)/2)
    Screen('Flip',wind1)
    WaitSecs(.5);
    legal=0;
    while legal == 0
        [keydown secs keycode]=KbCheck;
        key=KbName(keycode);
        if ischar(key)
            if strcmp(key,'space')
                legal=1;
            end
        end
    end
    Screen('Flip',wind1);
    WaitSecs(1);
    %
    
    trial=0;
    for block=1:nblock
        presorder=randperm(60);
        for iseq=1:60
            trial=trial+1;
            index=presorder(iseq);
            item=train(index);
            subtype=fix((item-1)/16) + 1;
            cat=fix((item-1)/160) + 1;
            item_store(trial)=item;
            subtype_store(trial)=subtype;
            cat_store(trial)=cat;
            [rockImage, ~, alpha] = imread([image_location pictures{item}]);
            rockImage(:,:,4) = alpha(:,:);
            [s1, s2, ~] = size(rockImage);
            s1=s1*imageScale;
            s2=s2*imageScale;
            rockPicture = Screen('MakeTexture',wind1,rockImage);
            Screen('DrawTexture',wind1,rockPicture,[],[centerx-s2+xshift centery-s1 centerx+s2+xshift centery+s1]);
            Screen('DrawText',wind1,promptcat,rect(3)/2-textbounds_promptcat(3)/2+xshift,topscreen);
            Screen('DrawText',wind1,IgMetSed,rect(3)/2-textbounds_IgMetSed(3)/2 + xshift,topscreen + 50);
            traintrial=[traintrialA num2str(trial) traintrialB];
            Screen('TextSize',wind1,20);
            Screen('DrawText',wind1,traintrial,10,topscreen);
            Screen('TextSize',wind1,textsize);
            Screen('Flip',wind1);
            Screen('Close',rockPicture);
            
            legal=0;
            start=GetSecs;
            while legal == 0
                [keydown secs keycode] = KbCheck;
                key=KbName(keycode);
                if ischar(key)
                    if any(strcmp(key,legalkeys))
                        rt=secs-start;
                        legal=1;
                    end
                end
            end
            %%
            
            resp=0;
            switch key
                case 'i'
                    resp=1;
                case 'm'
                    resp=2;
                case 's'
                    resp=3;
            end
            catresp_store(trial)=resp;
            catcorr_store(trial)=0;
            if resp == cat
                catcorr_store(trial)=1;
            end
            rt_store(trial)=round(1000*rt);
            
            Screen('Flip',wind1);
            
            Screen('TextSize',wind1,textsize)
            actualname=descript{cat};
            if catcorr_store(trial) == 1
                Screen('DrawText',wind1,text_correct,rect(3)/2-textbounds_correct(3)/2,topscreen);
            else
                Screen('DrawText',wind1,text_incorrect,rect(3)/2-textbounds_incorrect(3)/2,topscreen);
            end
            Screen('DrawText',wind1,actualname,centerx-feedxnameoffset,bottomscreen)
            rockPicture = Screen('MakeTexture',wind1,rockImage);
            Screen('DrawTexture',wind1,rockPicture,[],[centerx-s2 centery-s1 centerx+s2 centery+s1]);
            Screen('Flip',wind1);
            Screen('Close',rockPicture);
            
            fprintf(fid,'%5d',phase,block,iseq,trial,item_store(trial),oldnew,subtype_store(trial),cat_store(trial),catresp_store(trial),catcorr_store(trial));
            fprintf(fid,'%8d',rt_store(trial));
            fprintf(fid,'\n');
            WaitSecs(3);
            %WaitSecs(1);
            Screen('Flip',wind1);
        end
    end
    
    instructions_variability_test(wind1,rect);
    %
    Screen('TextSize',wind1,textsize)
    Screen('DrawText',wind1,wait10,rect(3)/2-textbounds_wait10(3)/2,rect(4)/2-textbounds_wait10(4)/2);
    Screen('Flip',wind1);
    WaitSecs(10);
    Screen('Flip',wind1);
    WaitSecs(2);
    Screen('DrawText',wind1,press_space_test,rect(3)/2-textbounds_press_space_test(3)/2,rect(4)/2-textbounds_press_space_test(4)/2)
    Screen('Flip',wind1)
    WaitSecs(.5);
    legal=0;
    while legal == 0
        [keydown secs keycode]=KbCheck;
        key=KbName(keycode);
        if ischar(key)
            if strcmp(key,'space')
                legal=1;
            end
        end
    end
    Screen('Flip',wind1);
    WaitSecs(1);
    
    
    % present test rocks and collect responses
    
    phase=2;
    testorder=randperm(480);
    for block=1:1
        for iseq=1:ntest
            trial=trial+1;
            item=testorder(iseq);
            
            %figure out the correct statement here...
            oldnew = any(item == train);
            
            subtype=fix((item-1)/16)+1;
            cat=fix((item-1)/160) + 1;
            item_test(iseq)=item;
            subtype_test(iseq)=subtype;
            cat_test(iseq)=cat;
            oldnew_test(iseq)=oldnew;
        [rockImage, ~, alpha] = imread([image_location pictures{item}]);
        rockImage(:,:,4) = alpha(:,:);
        [s1, s2, ~] = size(rockImage);
        s1=s1*imageScale;
        s2=s2*imageScale;
        rockPicture = Screen('MakeTexture',wind1,rockImage);
        Screen('DrawTexture',wind1,rockPicture,[],[centerx-s2 centery-s1 centerx+s2 centery+s1]);

        Screen('DrawText',wind1,promptcat,rect(3)/2-textbounds_promptcat(3)/2+xshift,topscreen);
        Screen('DrawText',wind1,IgMetSed,rect(3)/2-textbounds_IgMetSed(3)/2 + xshift,topscreen + 50);
        
        testtrial=[testtrialA num2str(iseq) testtrialB];
        Screen('TextSize',wind1,20);
        Screen('DrawText',wind1,testtrial,10,topscreen);
        Screen('TextSize',wind1,textsize);
        
        Screen('Flip',wind1);
        Screen('Close',rockPicture);
        legal=0;
        start=GetSecs;
        while legal == 0
            [keydown secs keycode] = KbCheck;
            key=KbName(keycode);
            if ischar(key)
                if any(strcmp(key,legalkeys))
                    rt=secs-start;
                    legal=1;
                end
            end
        end
        %%
        %
        % determine the subject's response
        %
        Screen('Flip',wind1);
        resp=0;
        switch key
            case 'i'
                resp=1;
            case 'm'
                resp=2;
            case 's'
                resp=3;
        end
        resp_test(iseq)=resp;
        rt_test(iseq)=round(1000*rt);
        correct=0;
        if resp == cat
            correct=1;
        end
        correct_test(iseq)=correct;
        if rt_test(iseq) < 250
            Screen('DrawText',wind1,too_fast,rect(3)/2-textbounds_too_fast(3)/2,topscreen);
            Screen('Flip',wind1);
            WaitSecs(4);
            Screen('Flip',wind1);
        elseif rt_test(iseq) > 7000
            Screen('DrawText',wind1,too_slow,rect(3)/2-textbounds_too_slow(3)/2,topscreen);
            Screen('Flip',wind1);
            WaitSecs(4);
            Screen('Flip',wind1);
        else
            Screen('DrawText',wind1,text_okay,rect(3)/2-textbounds_okay(3)/2,topscreen);
            Screen('Flip',wind1);
            WaitSecs(.5);
            Screen('Flip',wind1);
        end
        WaitSecs(1);
        fprintf(fid,'%5d',phase,block,iseq,trial,item_test(iseq),oldnew_test(iseq),subtype_test(iseq),cat_test(iseq),resp_test(iseq),correct_test(iseq));
        fprintf(fid,'%8d',rt_test(iseq));
        fprintf(fid,'\n');
        end
    end
    
    save(allvars);
    debriefing_variability(wind1,rect);
    Screen('DrawText',wind1,thanks,rect(3)/2-textbounds_thanks(3)/2,topscreen);
    Screen('Flip',wind1);
    WaitSecs(4);
    Screen('Flip',wind1);
    clear screen;
    
else
    disp('Error: The filname already exists! ');
end
