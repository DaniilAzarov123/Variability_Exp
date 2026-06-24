function instructions_descriptions_study(wind1,rect)
%yoffset=input('yoffset ');
yoffset=30;
%instructsize=input('instructsize ');
instructsize=20;
centerx=(rect(3)-rect(1))/2;
centery=(rect(4)-rect(2))/2;
yadjust=150;
%[wind1 rect] = Screen('OpenWindow',0,[255 255 255],[50 50 900 500]);
% [wind1 rect] = Screen('OpenWindow',0,[100 100 175]);
sent0='Welcome to our experiment! ';
sent1='In this first part of the experiment you will be presented ';
sent2=' with a series of 180 rock images. ';
sent3='The rocks belong to three different broad categories:';
sent4= '  Igneous, Metamorphic, and Sedimentary.';
sent5='On each trial, you will be asked to identify the category the rock belongs to';
sent6=' by pressing one of the keys on the keyboard: ';
sent7=' "I" = Igneous;  "M" = Metamorphic; or "S" = Sedimentary';
sent8='The computer will then tell you the correct answer.';
sent9='At first, most of you will probably be guessing.';
sent10='But by paying attention to the study items and the computer feedback,';
sent11=' you should gradually get better at identifying the rock types.';
sent12='After this study phase, we will then test you on some';
sent13=' additional rocks that belong to these categories. ';
sentlast=' PRESS SPACE TO CONTINUE';
blank=' ';

sentence={sent0 blank sent1 sent2 sent3 sent4 blank sent5 sent6 sent7 sent8 blank sent9 sent10 sent11 blank sent12 sent13};
Screen('TextSize',wind1,instructsize);
textbounds_sentlast=Screen('Textbounds',wind1,sentlast);

for i=1:18
    Screen('DrawText',wind1,sentence{i},50,1000-(21-i)*yoffset-400)
end
Screen('DrawText',wind1,sentlast,rect(3)/2-textbounds_sentlast(3)/2,rect(4)-50)
Screen('Flip',wind1)
%%
%      user presses space when ready to continue
%
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
Screen('Flip',wind1)
WaitSecs(.5);

