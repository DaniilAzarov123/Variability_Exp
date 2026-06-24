function instructions_descriptions_test(wind1,rect)
%yoffset=input('yoffset ');
yoffset=30;
%instructsize=input('instructsize ');
instructsize=20;
centerx=(rect(3)-rect(1))/2;
centery=(rect(4)-rect(2))/2;
yadjust=150;
%[wind1 rect] = Screen('OpenWindow',0,[255 255 255],[50 50 900 500]);
% [wind1 rect] = Screen('OpenWindow',0,[100 100 175]);
sent0='You have now completed the study-phase of the experiment ';
sent1='In a minute, we will start the final phase, which is a test phase.';
sent2='On each trial of this test phase, ';
sent3=' a rock image will again be presented on the screen.';
sent4='Some of the rocks will be old ones that you saw during the study phase.';
sent5='Other rocks will be new.';
sent6='Please continue to try to identify the category that the rock belong to';
sent7=' by pressing the I, M or S buttons on the keyboard';
sent8='In this test phase, the computer will not tell you if you were right or wrong';
sent9='It will simply say "Okay" to let you know that it received your response.';
sent9b='Note: you may find it extremely challenging to classify ';
sent9c=' many of the new rocks that you see during this test phase.';
sent9d='Please just do the best that you can!';
sent10='This test phase has a total of 300 trials.';
sentlast=' PRESS SPACE TO CONTINUE';
blank=' ';

sentence={sent0 sent1 blank sent2 sent3 sent4 sent5 sent6 sent7 blank sent8 sent9 blank sent9b sent9c sent9d blank sent10};
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

